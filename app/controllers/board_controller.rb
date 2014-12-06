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
    render json: Trello::Board.all
  end

  def show
    render json: Trello::Board.all[0]
  end
end
