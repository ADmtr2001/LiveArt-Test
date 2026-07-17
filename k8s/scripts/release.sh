#!/usr/bin/env sh

set -eu

IMAGE_NAMESPACE="${IMAGE_NAMESPACE:-admyr2001}"
IMAGE_NAME="${IMAGE_NAME:-liveart}"
RELEASE_TAG="${RELEASE_TAG:-}"

if [ -z "$RELEASE_TAG" ]; then
  echo "RELEASE_TAG is required, for example v2026.07.17-r1." >&2
  exit 1
fi

case "$RELEASE_TAG" in
  latest)
    echo "Use an immutable versioned release tag, not latest." >&2
    exit 1
    ;;
esac

IMAGE="$IMAGE_NAMESPACE/$IMAGE_NAME:$RELEASE_TAG"

docker build --pull --tag "$IMAGE" .
docker push "$IMAGE"

echo "Published $IMAGE"
echo "Deploy on Hetzner with: IMAGE=$IMAGE ./k8s/scripts/deploy.sh"

