"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createExpense } from "../utils/api";

export default function FormikPaymentForm({ onSubmitSuccess }) {
  const [categories, setCategories] = useState([]);
  const [households, setHouseholds] = useState([]);

  useEffect(() => {
    fetch("/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch("/households")
      .then((res) => res.json())
      .then((data) => setHouseholds(data));
  }, []);

  return (
    <div className="payment-form mb-6">
      <h2 className="text-xl font-semibold mb-3">Add New Payment</h2>

      <Formik
        initialValues={{
          amount: "",
          description: "",
          category_id: "",
          date: "",
          household_id: "",
          user_id: ""
        }}
        validationSchema={Yup.object({
          amount: Yup.number()
            .positive("Amount must be positive")
            .required("Amount is required"),
          date: Yup.date().required("Date is required"),
          category_id: Yup.number().required("Category is required"),
          household_id: Yup.number().required("Household is required"),
          user_id: Yup.number().required("User ID is required"),
        })}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          try {
            await createExpense(values);
            resetForm();
            if (onSubmitSuccess) onSubmitSuccess();
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
              <label className="block font-medium">Description</label>
              <Field
                type="text"
                name="description"
                className="w-full border px-3 py-2 rounded-md"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-medium">Category</label>
              <Field
                as="select"
                name="category_id"
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="category_id"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-medium">Household</label>
              <Field
                as="select"
                name="household_id"
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="">Select Household</option>
                {households.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="household_id"
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

            <div>
              <label className="block font-medium">User ID</label>
              <Field
                type="number"
                name="user_id"
                className="w-full border px-3 py-2 rounded-md"
              />
              <ErrorMessage
                name="user_id"
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
