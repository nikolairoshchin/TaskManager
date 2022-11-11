module PasswordResetsHelper

  TOKEN_EXPIRES_AT = 24.hour.from_now

  def password_reset_token_update(user)
    reset_token = SecureRandom.urlsafe_base64
    user.update( reset_digest: reset_token, reset_expires_at: TOKEN_EXPIRES_AT )
  end

  def get_user
    @user = User.find_by(reset_digest: params[:id])
    return @user if @user.present?
      flash[:alert] = "user not found"
      redirect_to root_url
  end

  def check_expiration
    if @user.reset_expires_at < Time.now
      flash[:alert] = "Password reset token has expired."
      redirect_to new_password_reset_url
    end
  end
end
