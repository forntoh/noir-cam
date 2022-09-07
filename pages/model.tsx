import { yupResolver } from "@hookform/resolvers/yup";
import {
  getUser,
  supabaseServerClient,
  withPageAuth,
} from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { Button, Input } from "../components/input";
import { PageWrapper } from "../components/PageWrapper";
import { useUpdateModel } from "../hooks/model";
import { Model } from "../typings";

export default function AddModel() {
  const { loading, upsert } = useUpdateModel();

  const validationSchema = object().shape({
    username: string().required(),
    email: string().required(),
    start_date: string().required().default(format(new Date(), "yyyy-MM-dd")),
    momo_number: string().required(),
  });

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<Model>({
    defaultValues: validationSchema.cast({}),
    resolver: yupResolver(validationSchema),
  });

  function updateModel(model: Model) {
    console.log(model);

    // const {
    //   data: { data: user, error },
    // } = await nextApi.post<ApiResponse<{ id: string }>>("/model", {
    //   email: model.email,
    //   password: model.username,
    // });

    // if (error) {
    //   setError(
    //     "email",
    //     { type: "custom", message: error.message },
    //     { shouldFocus: true }
    //   );
    // } else if (user) {
    //   delete model.email;
    //   model.user_id = user.id;
    //   console.log(user, model);
    //   await upsert(model);
    //   reset();
    // }
  }

  return (
    <PageWrapper>
      <div className="grow"></div>
      <form
        className="container space-y-10 pb-12"
        onSubmit={handleSubmit(updateModel)}
      >
        <p className="leading-6">Add a new model to the studio</p>
        <div className="flex flex-col gap-5">
          <Input placeholder="Username" type="text" {...register("username")} />
          <Input placeholder="Email" type="email" {...register("email")} />
          <Input placeholder="Date" type="date" {...register("start_date")} />
          <Input placeholder="Phone" type="text" {...register("momo_number")} />
        </div>
        <Button
          type="submit"
          className="bg-black text-white min-w-full"
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </Button>
      </form>
    </PageWrapper>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);

    const { data: isAdmin } = await supabaseServerClient(ctx).rpc("is_admin", {
      email: user.email,
    });

    if (!isAdmin) {
      ctx.res?.writeHead(302, { Location: "/" });
      ctx.res?.end();
    }

    return { props: {} };
  },
});
