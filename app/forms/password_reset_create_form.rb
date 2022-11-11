class PasswordResetCreateForm
  include ActiveModel::Model

  attr_accessor(
    :email
  )

  validates :email, presence: true, format: { with: /\A\S+@.+\.\S+\z/ }
  validate :user_valid?

  def user
   @user ||= User.find_by(email: email)
  end

  private

  def user_valid?
    errors.add(:email, "email not found" ) if user.blank?
  end
end
