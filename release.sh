#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if version argument is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Version number required${NC}"
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.0"
    exit 1
fi

VERSION=$1

# Validate version format (basic semver check)
if ! echo "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+)?$'; then
    echo -e "${RED}Error: Invalid version format${NC}"
    echo "Please use semantic versioning (e.g., 1.0.0 or 1.0.0-beta)"
    exit 1
fi

echo -e "${YELLOW}Preparing release v${VERSION}...${NC}"

# Ensure working directory is clean
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}Error: Working directory has uncommitted changes${NC}"
    echo "Please commit or stash your changes first"
    exit 1
fi

# Run tests
echo -e "${YELLOW}Running tests...${NC}"
if docker-compose up --exit-code-from test-client test-client; then
    echo -e "${GREEN}✓ Tests passed${NC}"
else
    echo -e "${RED}✗ Tests failed${NC}"
    exit 1
fi

# Tag the release
echo -e "${YELLOW}Creating git tag v${VERSION}...${NC}"
git tag -a "v${VERSION}" -m "Release version ${VERSION}"

# Push the tag
echo -e "${YELLOW}Pushing tag to GitHub...${NC}"
git push origin "v${VERSION}"

echo -e "${GREEN}✓ Release v${VERSION} created successfully!${NC}"
echo ""
echo "GitHub Actions will now:"
echo "  1. Run tests"
echo "  2. Build and push Docker image to ghcr.io"
echo "  3. Create GitHub release"
echo ""
echo "Monitor the build at: https://github.com/starburst997/docker-compose-wildcard/actions"