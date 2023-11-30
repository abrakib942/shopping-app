/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

const CustomForm = ({ children, submitHandler, defaultValues, resolver }) => {
  const formConfig = {};

  if (defaultValues) formConfig["defaultValues"] = defaultValues;
  if (resolver) formConfig["resolver"] = resolver;

  const methods = useForm(formConfig);

  const { handleSubmit, reset } = methods;

  const onSubmit = (data) => {
    submitHandler(data);
    reset();
  };

  useEffect(() => reset(defaultValues), [defaultValues, reset, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default CustomForm;
