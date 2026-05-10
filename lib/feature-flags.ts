// PIXEL_LIVE — flip to true in the SAME commit that installs the Meta Pixel script.
// CIPA exposure: the legal trigger is the Pixel script firing on a real visit, not the
// first ad campaign launch. Coupling the policy + banner copy to the install commit means
// no window where Pixel fires without disclosure. Do not flip ahead of the install.
export const PIXEL_LIVE = false;
