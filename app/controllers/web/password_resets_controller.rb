class Web::PasswordResetsController < Web::ApplicationController
  include PasswordResetsHelper
  before_action :get_user, only: [:edit, :update]
  before_action :check_expiration, only: [:edit, :update], if: :get_user

  def new
    @password_reset = PasswordResetCreateForm.new
  end

  def create
    @password_reset = PasswordResetCreateForm.new(password_reset_params)

    if @password_reset.valid?
      reset_token = create_reset_digest
      user = @password_reset.user
      user.update(reset_digest: reset_token, reset_sent_time: Time.zone.now)
      UserMailer.with({ user: user }).password_reset.deliver_now
      flash[:notice] = "Email sent to your e-mail address"
      redirect_to root_url
    else
      render :new
    end
  end

  def edit
    @edit_form = PasswordResetUpdateForm.new
    unless @user
      flash[:alert] = "user not found"
      redirect_to root_url
    end
  end

  def update
    if params[:password_reset_update_form][:password].blank?
      flash[:alert] = "password can not be blank"
    elsif  @user.update(password_reset_update_params)
      flash[:notice] = "Password has been reset."
      redirect_to root_url
    else
      self.edit
      flash[:alert] = "password and password confirmation are different"
      render :edit
    end
  end

  private

  def get_user
    @user = User.find_by(reset_digest: params[:id])
  end

  def check_expiration
    if @user.reset_sent_time < 24.hours.ago
      flash[:alert] = "Password reset has expired."
      redirect_to new_password_reset_url
    end
  end

  def password_reset_params
    params.require(:password_reset_create_form).permit(:email)
  end

  def password_reset_update_params
    update_params = params.require(:password_reset_update_form).permit(:password, :password_confirmation)
    reset_token_params = { reset_digest: '', reset_sent_time: '' }
    update_params.merge(reset_token_params)
  end
end
