class User < ApplicationRecord
  has_many :my_tasks, class_name: 'Task', foreign_key: :author_id
  has_many :assigned_tasks, class_name: 'Task', foreign_key: :assignee_id

  has_secure_password
  VALID_EMAIL_REGEX = /@/
  validates :first_name, :last_name,  presence: true, length: { minimum: 2 }
  validates :email, uniqueness: true, format: { with: VALID_EMAIL_REGEX }
end
