class GrocerController < ApplicationController
  def show
    terms = JSON.parse(params[:items])
    terms.each do |term|
      puts term
    end
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
      search = loggedin_page.forms[2]
      search_box = search.field_with(:id => "form-search-input")
      search_box.value = term
      search_button = search.button_with(:value => 'Go')
      results = search.submit(search_button)
      items = []
      results.search('div.id-productItems > div.widget').each do |widget|
        price = widget.search('div.widget-content')
        item = JSON.parse(price.children[0].children[0].text)
        items.push(item)      
      end
      item_lists[term] = items
    end
    render json: item_lists
  end
end
