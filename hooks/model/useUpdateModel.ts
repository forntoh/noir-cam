import { Model } from "../../typings";
import { upsert } from "../../utils/supabaseRunner";

export default () => {
  return upsert<Model>("models");
};
