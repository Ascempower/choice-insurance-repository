#!/bin/bash

# Step 1: Define what to keep
ESSENTIAL_FILES=(
  "index.html"
  "about.html"
  "accessibility-statement.html"
  "blog.html"
  "contact.html"
  "faq.html"
  "privacy-policy.html"
  "services.html"
  "testimonials.html"
  "manifest.json"
  "sw.js"
  "README.md"
  ".gitignore"
  ".env.example"
  "_redirects"
  "netlify.toml"
)

ESSENTIAL_DIRS=(
  "assets"
  "services"
)

# Step 2: Remove known duplicate or backup HTML files
find . -maxdepth 1 -type f \( -name "*-old.html" -o -name "*-backup.html" -o -name "*copy*.html" \) -exec rm -v {} \;

# Step 3: Remove folders that are old updates or backup folders
find . -maxdepth 1 -type d \( -name "choice-insurance-*updates*" -o -name "*-backup*" -o -name "*-old*" \) ! -name "assets" ! -name "services" -exec rm -rfv {} \;

# Step 4: Remove files that are not essential (excluding the script itself)
for file in *; do
  skip=false
  for keep in "${ESSENTIAL_FILES[@]}"; do
    if [[ "$file" == "$keep" ]]; then
      skip=true
      break
    fi
  done
  for dir in "${ESSENTIAL_DIRS[@]}"; do
    if [[ "$file" == "$dir" ]]; then
      skip=true
      break
    fi
  done
  [[ "$file" == "$(basename "$0")" ]] && skip=true
  if [ "$skip" = false ]; then
    rm -rfv "$file"
  fi
done

echo "Cleanup complete. Kept essential files and directories."