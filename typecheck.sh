#!/bin/bash

echo "🔍 Running TypeScript type checking..."

# Run TypeScript compiler in noEmit mode to check types
npx tsc --noEmit --pretty

# Check the exit code
if [ $? -eq 0 ]; then
    echo "✅ No TypeScript errors found!"
else
    echo "❌ TypeScript errors detected. Please fix them before building."
    exit 1
fi