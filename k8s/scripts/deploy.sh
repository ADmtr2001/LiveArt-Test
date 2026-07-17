#!/usr/bin/env sh

set -eu

NAMESPACE="${NAMESPACE:-liveart}"
MANIFEST_DIR="${MANIFEST_DIR:-k8s}"
PUBLIC_URL="${PUBLIC_URL:-https://liveart.dmytrenko.dev}"
IMAGE="${IMAGE:-}"

if [ -z "$IMAGE" ]; then
  echo "IMAGE is required, for example admyr2001/liveart:v2026.07.17-r1." >&2
  exit 1
fi

case "$IMAGE" in
  *:latest)
    echo "Refusing a mutable latest tag in production." >&2
    exit 1
    ;;
esac

kubectl apply -f "$MANIFEST_DIR/namespace.yaml"
kubectl apply -f "$MANIFEST_DIR/app.yaml"
kubectl apply -f "$MANIFEST_DIR/ingress.yaml"
kubectl set image deployment/liveart "liveart=$IMAGE" -n "$NAMESPACE"

if ! kubectl rollout status deployment/liveart -n "$NAMESPACE" --timeout=180s; then
  kubectl get deployment,pod -n "$NAMESPACE" >&2
  kubectl describe deployment/liveart -n "$NAMESPACE" >&2
  kubectl logs deployment/liveart -n "$NAMESPACE" --tail=100 >&2 || true
  exit 1
fi

attempt=1
while [ "$attempt" -le 30 ]; do
  if kubectl get certificate liveart-tls -n "$NAMESPACE" >/dev/null 2>&1; then
    break
  fi
  sleep 2
  attempt=$((attempt + 1))
done

if kubectl get certificate liveart-tls -n "$NAMESPACE" >/dev/null 2>&1; then
  kubectl wait --for=condition=Ready certificate/liveart-tls \
    -n "$NAMESPACE" --timeout=300s
fi

kubectl get deployment,service,ingress,pod,certificate -n "$NAMESPACE"

attempt=1
while [ "$attempt" -le 30 ]; do
  if health="$(curl --fail --silent --show-error "$PUBLIC_URL/healthz" 2>/dev/null)" && \
    [ "$health" = "ok" ]; then
    echo "Production health check passed."
    echo "Deployed $IMAGE to $PUBLIC_URL"
    exit 0
  fi
  sleep 2
  attempt=$((attempt + 1))
done

echo "Deployment rolled out, but $PUBLIC_URL/healthz did not become ready." >&2
exit 1
