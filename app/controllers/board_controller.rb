class BoardController < ApplicationController
  def new    
    render json: "New not implemented"
  end

  def create
    render json: "Create not implemented"
  end

  def update
    render json: "Create not implemented"
  end

  def edit
    render json: "Create not implemented"
  end

  def destroy
    render json: "Create not implemented"
  end

  def index
    client = Trello::Client.new(
      :developer_public_key => Rails.application.config.trello_api_key,
      :member_token => params[:token]
    )    
    boards = client.get("/members/me/boards")
    render json: boards
  end

  def show
    client = Trello::Client.new(
      :developer_public_key => Rails.application.config.trello_api_key,
      :member_token => params[:token]
    )    
    board = client.find(:boards, params[:id])
    # board = Trello::Board.find(params[:id])
    render json: {:board => board, :lists => board.lists} 
  end
end
