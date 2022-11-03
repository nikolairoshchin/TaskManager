class Web::PasswordResetsController < Web::ApplicationController
  include PasswordResetsHelper
  before_action :get_user, :check_expiration, only: [:edit, :update]

  TOKEN_EXPIRES_AT = 24.hour.from_now

  def new
    @password_reset = PasswordResetCreateForm.new
  end

  def create
    @password_reset = PasswordResetCreateForm.new(password_reset_params)

    return render :new if @password_reset.invalid?

    reset_token = create_reset_digest
    user = @password_reset.user
    user.update(reset_digest: reset_token, reset_expires_at: TOKEN_EXPIRES_AT )
    UserMailer.with({ user: user }).password_reset.deliver_now
    flash[:notice] = "Email sent to your e-mail address"
    redirect_to root_url
  end

  def edit
    @edit_form = PasswordResetUpdateForm.new
  end

  def update
    @edit_form = PasswordResetUpdateForm.new(password_reset_update_params)
    if @user.update(password_reset_update_params)
      flash[:notice] = "Password has been reset."
      redirect_to root_url
    else
      flash[:alert] = "password and password confirmation are different"
      render :edit
    end
  end

  private

  def get_user
    @user = User.find_by(reset_digest: params[:id])
    unless @user
      flash[:alert] = "user not found"
      redirect_to root_url
    end
  end

  def check_expiration
    if @user.reset_expires_at < Time.now
      flash[:alert] = "Password reset token has expired."
      redirect_to new_password_reset_url
    end
  end

  def password_reset_params
    params.require(:password_reset_create_form).permit(:email)
  end

  def password_reset_update_params
    update_params = params.require(:password_reset_update_form).permit(:password, :password_confirmation)
    reset_token_params = { reset_digest: '', reset_expires_at: '' }
    update_params.merge(reset_token_params)
  end
end
