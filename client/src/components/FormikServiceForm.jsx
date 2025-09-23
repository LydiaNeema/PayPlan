import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Wallet, Check, X } from "lucide-react";

const serviceSchema = Yup.object().shape({
  name: Yup.string().required("Service name is required"),
  amount: Yup.number().required("Amount is required").positive(),
});

export default function FormikServiceForm({ initialValues, onSubmit, onCancel }) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={serviceSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <div>
            <label>Service Name</label>
            <Field name="name" placeholder="Netflix" />
            <ErrorMessage name="name" component="div" className="text-red-500" />
          </div>

          <div>
            <label>Amount</label>
            <div className="flex items-center">
              <Wallet size={20} />
              <Field name="amount" placeholder="KES 0.00" />
            </div>
            <ErrorMessage name="amount" component="div" className="text-red-500" />
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={onCancel}><X /></button>
            <button type="submit" disabled={isSubmitting}><Check /></button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
