#!/bin/bash

pwd;
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "master"  ]] ; then
  git diff --quiet HEAD^ HEAD ./{.storybook,src,public};
else
  echo "🛑 - Build cancelled"
  exit 0;
fi