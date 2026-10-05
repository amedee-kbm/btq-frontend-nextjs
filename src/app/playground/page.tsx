"use client";

import { useForm } from "react-hook-form";

export default function Playground() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: Record<string, unknown>) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name</label>
        <input
          {...register("name", { required: "Name required" })}
          type="text"
          placeholder="Mugisha Jules"
          autoComplete="username"
        />
      </div>
      <div>
        <label>Email</label>
        <input
          {...register("email", { required: "Email required" })}
          type="email"
          placeholder="mugisha@email.com"
          autoComplete="username"
        />
      </div>
      <div>
        <label>Password</label>
        <input
          {...register("password", { required: "Password required" })}
          type="password"
          autoComplete="new-password"
          placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
        />
      </div>

      <div>
        <label>Repeat password</label>
        <input
          {...register("repeatPassword", {
            required: "Repeat password required",
          })}
          type="password"
          autoComplete="new-password"
          placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
        />
      </div>

      <button type="submit">Register</button>
    </form>
  );
}
