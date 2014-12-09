class CardController < ApplicationController
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
    puts params
    client = Trello::Client.new(
      :developer_public_key => Rails.application.config.trello_api_key,
      :member_token => params[:token]
    )    
    card = client.find(:card, params[:id])    
    # card = Trello::Card.find(params[:id])
    render json: {:card => card, :checklists => card.checklists}
  end
end
