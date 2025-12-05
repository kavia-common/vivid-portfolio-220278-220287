#!/bin/bash
cd /home/kavia/workspace/code-generation/vivid-portfolio-220278-220287/backend_api
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

