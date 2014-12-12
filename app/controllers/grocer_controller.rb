class GrocerController < ApplicationController
  
  def index
  end

  def show
    terms = JSON.parse(params[:items])
    mechanize = Mechanize.new
    
    page = mechanize.get('https://shop.safeway.com/ecom/account/sign-in')
    
    signin = page.forms[4]    
    username_field = signin.field_with(:id => 'SignIn_EmailAddress')
    username_field.value = Rails.application.config.grocer_email
    password_field = signin.field_with(:id => 'SignIn_Password')
    password_field.value = Rails.application.config.grocer_pass
    submit_button = signin.button_with(:name => 'signInButton')
    loggedin_page = signin.submit(submit_button)
    item_lists = {}
    terms.each do |term|   
      items = []
      search = loggedin_page.forms[2]
      search_box = search.field_with(:id => "form-search-input")
      search_box.value = term
      search_button = search.button_with(:value => 'Go')
      results = search.submit(search_button)
      widgets = results.search('div.id-productItems > div.widget')
      widgets.each do |widget|        
        content = widget.search('div.widget-content')
        item = JSON.parse(content.children[0].children[0].text)
        items.push(item)      
      end
      item_lists[term] = items
    end
    render json: item_lists
  end

  def update
    if params[:adding].eql? 'true' 
      button = "increment"
    elsif params[:adding].eql? 'false'
      button = "decrement"
    else
      render json: "Invalid adding parameter"
      return
    end
    
    session = Capybara::Session.new(:poltergeist)
    session.visit('https://shop.safeway.com/ecom/account/sign-in')
    session.fill_in "SignIn_EmailAddress", :with => Rails.configuration.grocer_email
    session.fill_in "SignIn_Password", :with => Rails.configuration.grocer_pass
    session.first('.btn-signin > input').click
    session.fill_in "form-search-input", :with => params[:term]
    session.first('.btn-go > input').click
    begin 
    increment = session.find(:xpath, '//div[@class="id-productItems"]//div[contains(concat(" ", normalize-space(@class), " "), " widget ")]//form[@id="form-productItem-%s"]//a[@class="id-%s"]' % [params[:id], button])
    increment.click
    rescue Capybara::ElementNotFound
      render json: "Failed to update: no increment button"
      session.first('.btn-signout > input').click
      session.driver.quit    
      return
    end
    begin 
      session.find(:xpath, '//div[@class="id-productItems"]//div[contains(concat(" ", normalize-space(@class), " "), " widget ")]//form[@id="form-productItem-%s"]//input[@name="add"]' % params[:id] ).click
    rescue Capybara::ElementNotFound
      begin
        session.find(:xpath, '//div[@class="id-productItems"]//div[contains(concat(" ", normalize-space(@class), " "), " widget ")]//form[@id="form-productItem-%s"]//input[@name="update"]' % params[:id]).click
      rescue Capybara::ElementNotFound
        render json: "Failed to update: button did not load"
        session.first('.btn-signout > input').click
        session.driver.quit    
        return
      end
    end  
    session.driver.save_screenshot './screenshot.png'
    render json: "Successfully updated"
    session.first('.btn-signout > input').click
    session.driver.quit    
  end
end
