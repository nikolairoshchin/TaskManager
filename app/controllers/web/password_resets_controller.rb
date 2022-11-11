class Web::PasswordResetsController < Web::ApplicationController
  include PasswordResetsHelper
  before_action :get_user, :check_expiration, only: [:edit, :update]

  def new
    @password_reset = PasswordResetCreateForm.new
  end

  def create
    @password_reset = PasswordResetCreateForm.new(password_reset_params)

    return render :new if @password_reset.invalid?

    user = @password_reset.user
    password_reset_token_update(user)
    SendPasswordResetNotificationJob.perform_async(user.id)
    flash[:notice] = "Email sent to your e-mail address"
    redirect_to root_url
  end

  def edit
    @edit_form = PasswordResetUpdateForm.new
  end

  def update
    @edit_form = PasswordResetUpdateForm.new(password_reset_edit_params)

    return render :edit if @edit_form.invalid?
    @user.update(password_reset_update_params)
    flash[:notice] = "Password has been reset."
    redirect_to root_url
  end

  private

  def password_reset_params
    params.require(:password_reset_create_form).permit(:email)
  end

  def password_reset_edit_params
    params.require(:password_reset_update_form).permit(:password, :password_confirmation)
  end

  def password_reset_update_params
    reset_token_params = { reset_digest: '', reset_expires_at: '' }
    password_reset_edit_params.merge(reset_token_params)
  end
end
