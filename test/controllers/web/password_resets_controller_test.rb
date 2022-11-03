require "test_helper"

class Web::PasswordResetsControllerTest < ActionController::TestCase

  def setup
    @user = create(:user)
    @user.update( reset_digest: 'test_digest', reset_expires_at: 24.hour.from_now )
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "wrong email" do
    post :create, params: { password_reset_create_form: { email: "" }}
    assert_response :success
    assert flash.empty?
  end

  test "correct email" do
    assert_emails 1 do
      post :create, params: { password_reset_create_form: { email: @user.email }}
    end

    assert_equal "Email sent to your e-mail address", flash[:notice]
    assert_redirected_to root_url
    assert_not_equal @user.reset_digest, @user.reload.reset_digest
  end

  test "password reset form" do
    get :edit, params: { id: @user.reset_digest }
    assert_response :success
  end

  test "wrong token" do
    get :edit, params: { id: '123' }
    assert_equal "user not found", flash[:alert]
    assert_redirected_to root_url
  end

  test "correct token" do
    get :edit, params: { id: @user.reset_digest }
    assert_response :success
  end

  test "token expired" do
    @user.update( reset_expires_at: 1.hour.ago )
    get :edit, params: { id: @user.reset_digest }
    assert_equal "Password reset token has expired.", flash[:alert]
    assert_redirected_to new_password_reset_url
  end

  test "password do not match confirmation" do
    patch :update, params: { id: @user.reset_digest, password_reset_update_form: { password: '123', password_confirmation: '1' }}
    assert_equal "password and password confirmation are different", flash[:alert]
    assert_response :success
  end

  test "correct password" do
    patch :update, params: { id: @user.reset_digest, password_reset_update_form: { password: '123', password_confirmation: '123' }}
    assert_equal "Password has been reset.", flash[:notice]
    assert_redirected_to root_url
  end
end
