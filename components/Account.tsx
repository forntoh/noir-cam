import { yupResolver } from "@hookform/resolvers/yup";
import { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { date, object, string } from "yup";
import useProfile from "../hooks/useProfile";
import useUpdateProfile from "../hooks/useUpdateProfile";
import { Profile } from "../typings";
import { supabase } from "../utils/supabaseClient";

type Props = {
  session: Session;
};

export default function Account({ session }: Props) {
  const { loading: loading1, data, loadData } = useProfile();
  const { loading: loading2, upsert } = useUpdateProfile();

  const loading = loading1 || loading2;

  const validationSchema = object().shape({
    id: string().default(supabase.auth.user()?.id),
    first_name: string()
      .required()
      .default(() => data?.first_name),
    last_name: string()
      .required()
      .default(() => data?.last_name),
    address: string()
      .required()
      .default(() => data?.address),
    city: string()
      .required()
      .default(() => data?.city),
    date_of_birth: date()
      .required()
      .default(() => new Date()),
    updated_at: date().default(() => new Date()),
  });

  useEffect(() => {
    loadData();
  }, [session]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Profile>({
    defaultValues: validationSchema.cast({}),
    resolver: yupResolver(validationSchema),
  });

  async function updateProfile(profile: Profile) {
    await upsert(profile);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(updateProfile)}>
      <div>
        <label htmlFor="first_name">First name</label>
        <input type="text" {...register("first_name")} />
      </div>
      <div>
        <label htmlFor="last_name">Last name</label>
        <input type="text" {...register("last_name")} />
      </div>
      <div>
        <label htmlFor="date_of_birth">Date of birth</label>
        <input type="date" {...register("date_of_birth")} />
      </div>
      <div>
        <label htmlFor="address">Address</label>
        <input type="text" {...register("address")} />
      </div>
      <div>
        <label htmlFor="city">City</label>
        <input type="text" {...register("city")} />
      </div>
      <div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>
    </form>
  );
}
