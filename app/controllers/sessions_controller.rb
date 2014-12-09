class SessionsController < ApplicationController
 layout false
 
  def new
  end
 
  def create    
    # render json: "Replaced with client-side authorization"
    @auth = request.env['omniauth.auth']['credentials']
    @token = Token.create(
      access_token: @auth['token'],
      secret: @auth['secret'])
    puts "GENERATED TOKEN"
    redirect_to("/#/login/token=#{@token.access_token}")
    # render json: @token.access_token
  end
end
