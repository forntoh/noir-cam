import { Profile } from "../typings";
import { upsert } from "../utils/supabaseRunner";

export default () => {
  return upsert<Profile>("profiles");
};
