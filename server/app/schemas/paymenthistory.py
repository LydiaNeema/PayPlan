from marshmallow import Schema, fields

class PaymentHistorySchema(Schema):
    id = fields.Int(dump_only=True)
    amount = fields.Float(required=True)
    due_date = fields.Date(required=True, data_key="dueDate")
    paid = fields.Bool()
    paid_date = fields.DateTime(data_key="paidDate")
    reimbursed = fields.Bool()
    service_id = fields.Int(allow_none=True)
    service_name = fields.Str(attribute="serviceName")
    user_id = fields.Int()
    manual_name = fields.Str(allow_none=True)
    category = fields.Str(allow_none=True)
    color = fields.Str(allow_none=True)