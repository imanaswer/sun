// three ships its own types, but they don't resolve through the bun store path
// under this project's moduleResolution. Declare the module so the merged
// sticker-peeling 3D effect type-checks.
// ponytail: loose typing for a decorative WebGL component; drop this if @types
// resolution is fixed.
declare module "three";
