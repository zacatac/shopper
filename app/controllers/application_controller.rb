class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  after_filter  :set_csrf_cookie_for_ng

  def ping
    render text: "Rails Backend 1.0"
  end

  require 'trello'  
  Trello.configure do |trello|
    trello.consumer_key = Rails.application.config.trello_api_key
    trello.consumer_secret = Rails.application.config.trello_api_secret
    trello.oauth_token = "TRELLO_OAUTH_TOKEN"
    trello.oauth_token_secret = "TRELLO_OAUTH_TOKEN_SECRET"
    # trello.developer_public_key = Rails.application.config.trello_api_key
    # trello.member_token = "FORCED TO PUT THIS SO BASIC AUTH WILL BE RECOGNIZED"
  end  

private

  #http://stackoverflow.com/questions/14734243/rails-csrf-protection-angular-js-protect-from-forgery-makes-me-to-log-out-on
  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  def verified_request?
    super || form_authenticity_token == request.headers['HTTP_X_XSRF_TOKEN']
  end
end
