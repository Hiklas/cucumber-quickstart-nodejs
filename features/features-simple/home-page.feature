Feature: Simple testing for the home page
  As a user
  I want to ensure I can see the home page
  In order to navigate to the rest of the site

  Background:
    Given I am using a Web Browser client

  Scenario: I navigate to the home page
    Given I open the browser
     When I navigate to the Hiklas Home page
     Then The page I am on has the correct title
      And There is a Carousel element


