require "test_helper"

class Web::PasswordResetsControllerTest < ActionController::TestCase

  def setup
    @user = create(:user)    
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "password reset" do

    #wrong email
    post :create, params: { password_reset_create_form: { email: "" }}
    assert_response :success
    assert flash.empty?

    #correct email
    assert_emails 1 do
      post :create, params: { password_reset_create_form: { email: @user.email }}
    end

    assert_equal "Email sent to your e-mail address", flash[:notice]
    assert_redirected_to root_url
    assert_not_equal @user.reset_digest, @user.reload.reset_digest

    #password reset form
    get :edit, params: { id: @user.reset_digest }
    assert_response :success

    #wrong token
    get :edit, params: { id: '123' }
    assert_equal "user not found", flash[:alert]
    assert_redirected_to root_url

    #correct token
    get :edit, params: { id: @user.reset_digest }
    assert_response :success

    #password do not match confirmation
    patch :update, params: { id: @user.reset_digest, password_reset_update_form: { password: '123', password_confirmation: '1' }}
    assert_equal "password and password confirmation are different", flash[:alert]
    assert_response :success

    #empty password
    patch :update, params: { id: @user.reset_digest, password_reset_update_form: { password: '', password_confirmation: '' }}
    assert_equal "password can not be blank", flash[:alert]
    assert_response :success

    #correct password
    patch :update, params: { id: @user.reset_digest, password_reset_update_form: { password: '123', password_confirmation: '123' }}
    assert_equal "Password has been reset.", flash[:notice]
    assert_redirected_to root_url
  end
end
