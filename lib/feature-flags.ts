// PIXEL_LIVE — flip to true in the SAME commit that installs the Meta Pixel script.
// CIPA exposure: the legal trigger is the Pixel script firing on a real visit, not the
// first ad campaign launch. Coupling the policy + banner copy to the install commit means
// no window where Pixel fires without disclosure. Do not flip ahead of the install.
export const PIXEL_LIVE = true;

// ADVANCED_MATCHING_LIVE — flip to true in the SAME commit that ships the
// trackLead() user_data wiring AND the corresponding privacy-policy disclosure.
// Manual Advanced Matching transmits hashed name/email/phone alongside the Lead
// event so Meta can match the conversion to a specific user account. Same atomic
// coupling discipline as PIXEL_LIVE: the legal trigger is the user_data fields
// going over the wire, not when the first ad runs — so disclosure must light up
// in the same diff. Do not flip ahead of the code + policy update.
export const ADVANCED_MATCHING_LIVE = true;
