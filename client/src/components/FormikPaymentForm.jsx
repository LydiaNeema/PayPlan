"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createExpense } from "../utils/api";

export default function FormikPaymentForm({ onSubmitSuccess }) {
  return (
    <div className="payment-form mb-6">
      <h2 className="text-xl font-semibold mb-3">Add New Payment</h2>

      <Formik
        initialValues={{ title: "", amount: "", date: "" }}
        validationSchema={Yup.object({
          title: Yup.string().required("Title is required"),
          amount: Yup.number()
            .positive("Amount must be positive")
            .required("Amount is required"),
          date: Yup.date().required("Date is required"),
        })}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          try {
            await createExpense({
              ...values,
              reimbursed: false, // default new expense as unreimbursed
            });
            resetForm();
            if (onSubmitSuccess) onSubmitSuccess(); // refresh the list
          } catch (error) {
            console.error("Error creating expense:", error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 border rounded-lg p-4 shadow-md">
            <div>
              <label className="block font-medium">Title</label>
              <Field
                type="text"
                name="title"
                className="w-full border px-3 py-2 rounded-md"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-medium">Amount</label>
              <Field
                type="number"
                name="amount"
                className="w-full border px-3 py-2 rounded-md"
              />
              <ErrorMessage
                name="amount"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-medium">Date</label>
              <Field
                type="date"
                name="date"
                className="w-full border px-3 py-2 rounded-md"
              />
              <ErrorMessage
                name="date"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              {isSubmitting ? "Saving..." : "Add Payment"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
