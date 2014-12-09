class ListController < ApplicationController
  def new
  end

  def create
  end

  def update
  end

  def edit
  end

  def destroy
  end

  def index
  end

  def show    
    client = Trello::Client.new(
      :developer_public_key => Rails.application.config.trello_api_key,
      :member_token => params[:token]
    )    
    list = client.find(:list, params[:id])    
    # list = Trello::List.find(params[:id])
    render json: {:list => list, :cards => list.cards}
  end
end
