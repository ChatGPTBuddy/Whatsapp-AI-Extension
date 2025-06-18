// Simple test file to verify OpenAI integration setup
// This file can be used to test the OpenAI integration once you have set up your API key

const { autoComplete } = require("./openai.js");

async function testOpenAI() {
  // Sample test data similar to what the WhatsApp extension would send
  const testHistory = [
    { user: "Elliott", text: "yo are you coming to the dinner tonight?" },
    { user: "Sithu", text: "where and when?" },
    { user: "Timothy", text: "hmm i need to check with my parents" },
    { user: "Elliott", text: "we're going to holland village for some drinks" }
  ];
  
  const testOutputUser = "Timothy";

  try {
    console.log("Testing OpenAI integration...");
    console.log("Input history:", testHistory);
    console.log("Output user:", testOutputUser);
    
    const result = await autoComplete(testHistory, testOutputUser);
    
    console.log("Success! OpenAI response:");
    console.log(JSON.stringify(result, null, 2));
    
    // Verify the response structure matches what the frontend expects
    if (result.predictions && result.predictions[0] && result.predictions[0].content) {
      console.log("\n✅ Response structure is compatible with frontend expectations");
      console.log("Generated options:");
      const options = result.predictions[0].content.split('\n').filter(line => line.trim());
      options.forEach((option, index) => {
        console.log(`${index + 1}. ${option}`);
      });
    } else {
      console.log("\n❌ Response structure doesn't match expected format");
    }
    
  } catch (error) {
    console.error("❌ Test failed:");
    if (error.message.includes("API key")) {
      console.error("Please make sure you have set your OPENAI_API_KEY in the .env file");
    } else {
      console.error(error.message);
    }
  }
}

// Only run the test if this file is executed directly
if (require.main === module) {
  testOpenAI();
}

module.exports = { testOpenAI };
