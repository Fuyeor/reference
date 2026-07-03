**reference** (reference.fuyeor.com) is a documentation platform for Ф.

## Documentation

All documentation content is managed within the `/content/` directory.

## Development

### Locale Generation

Due to path compatibility constraints in the current version of `locale-cli`, a symbolic link (symlink) must be created as a temporary workaround until the tool is updated:

```bash
# Navigate to the apps directory
cd apps
mkdir -p reference

# Create a symlink to map the structure for locale-cli
cd reference
ln -s ../front-end front-end

# Return to root and generate locales
cd ../../
pnpm locale make reference
```