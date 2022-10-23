module PasswordResetsHelper
  def create_reset_digest
    reset_token = SecureRandom.urlsafe_base64
  end
end
