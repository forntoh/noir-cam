import { Session } from "@supabase/supabase-js";
import { date, object, string } from "yup";
import { useUpdateModel } from "../hooks/model";

type Props = {
  session: Session;
};

export default function Account({ session }: Props) {
  const { loading, upsert } = useUpdateModel();

  const validationSchema = object().shape({
    username: string().required(),
    email: string().required(),
    start_date: date().required(),
    momo_number: string().required(),
    updated_at: date().default(() => new Date()),
  });

  // const {
  //   register,
  //   handleSubmit,
  //   setError,
  //   reset,
  //   formState: { errors },
  // } = useForm<Model>({
  //   defaultValues: validationSchema.cast({}),
  //   resolver: yupResolver(validationSchema),
  // });

  // async function updateModel(model: Model) {
  //   const {
  //     data: { data: user, error },
  //   } = await nextApi.post<ApiResponse<{ id: string }>>("/model", {
  //     email: model.email,
  //     password: model.username,
  //   });

  //   if (error) {
  //     setError(
  //       "email",
  //       { type: "custom", message: error.message },
  //       { shouldFocus: true }
  //     );
  //   } else if (user) {
  //     delete model.email;
  //     model.user_id = user.id;
  //     console.log(user, model);
  //     await upsert(model);
  //     reset();
  //   }
  // }

  return (
    <form>
      {/* <form onSubmit={handleSubmit(updateModel)}> */}
      <div>
        <label htmlFor="first_name">Username</label>
        <input type="text" {...register("username")} />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" {...register("email")} />
      </div>
      <div>
        <label htmlFor="date_of_birth">Start date</label>
        <input type="date" {...register("start_date")} />
      </div>
      <div>
        <label htmlFor="address">Momo number</label>
        <input type="text" {...register("momo_number")} />
      </div>
      <div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>
    </form>
  );
}
