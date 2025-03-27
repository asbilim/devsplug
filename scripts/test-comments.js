/**
 * Test script for comments feature
 *
 * This script can be run to test the functionality of the comments section.
 * It will make API calls to create, fetch, like, and delete comments.
 *
 * Usage:
 *   node scripts/test-comments.js [challenge-slug] [solution-id]
 */

const fetch = require("node-fetch");
const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Default values
let BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
let ACCESS_TOKEN = "";
let CHALLENGE_SLUG = "";
let SOLUTION_ID = "";

// Parse command-line arguments
if (process.argv.length >= 4) {
  CHALLENGE_SLUG = process.argv[2];
  SOLUTION_ID = process.argv[3];
}

async function promptForInput() {
  if (!CHALLENGE_SLUG) {
    CHALLENGE_SLUG = await askQuestion("Enter challenge slug: ");
  }

  if (!SOLUTION_ID) {
    SOLUTION_ID = await askQuestion("Enter solution ID: ");
  }

  ACCESS_TOKEN = await askQuestion("Enter your access token: ");

  const customBackendUrl = await askQuestion(
    `Enter backend URL [${BACKEND_URL}]: `
  );
  if (customBackendUrl) {
    BACKEND_URL = customBackendUrl;
  }
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

async function getComments() {
  console.log("\n📋 Fetching comments...");

  try {
    const response = await fetch(
      `${BACKEND_URL}/challenges/listings/${CHALLENGE_SLUG}/solutions/${SOLUTION_ID}/comments/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Fetched comments successfully:");
    console.log("Total comments:", data.pagination?.total || "Unknown");
    console.log("Comments:", JSON.stringify(data.results, null, 2));

    return data.results;
  } catch (error) {
    console.error("❌ Failed to fetch comments:", error.message);
    return [];
  }
}

async function createComment(content, parentId = null) {
  console.log(`\n✏️ Creating ${parentId ? "reply" : "comment"}...`);

  try {
    const response = await fetch(
      `${BACKEND_URL}/challenges/listings/${CHALLENGE_SLUG}/solutions/${SOLUTION_ID}/comments/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          content,
          parent: parentId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Error ${response.status}: ${
          JSON.stringify(errorData) || response.statusText
        }`
      );
    }

    const data = await response.json();
    console.log("✅ Comment created successfully:");
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("❌ Failed to create comment:", error.message);
    return null;
  }
}

async function likeComment(commentId) {
  console.log(`\n❤️ Liking comment ${commentId}...`);

  try {
    const response = await fetch(
      `${BACKEND_URL}/challenges/listings/${CHALLENGE_SLUG}/solutions/${SOLUTION_ID}/comments/${commentId}/like/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Comment liked successfully:");
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error("❌ Failed to like comment:", error.message);
    return null;
  }
}

async function deleteComment(commentId) {
  console.log(`\n🗑️ Deleting comment ${commentId}...`);

  try {
    const response = await fetch(
      `${BACKEND_URL}/challenges/listings/${CHALLENGE_SLUG}/solutions/${SOLUTION_ID}/comments/${commentId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    console.log("✅ Comment deleted successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to delete comment:", error.message);
    return false;
  }
}

async function reportComment(commentId, reason) {
  console.log(`\n🚩 Reporting comment ${commentId}...`);

  try {
    const response = await fetch(
      `${BACKEND_URL}/challenges/listings/${CHALLENGE_SLUG}/solutions/${SOLUTION_ID}/comments/${commentId}/report/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ reason }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    console.log("✅ Comment reported successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to report comment:", error.message);
    return false;
  }
}

async function runTest() {
  await promptForInput();

  console.log("\n🧪 STARTING COMMENT SYSTEM TEST");
  console.log("=============================");
  console.log(`Challenge: ${CHALLENGE_SLUG}`);
  console.log(`Solution: ${SOLUTION_ID}`);
  console.log(`Backend URL: ${BACKEND_URL}`);

  // Step 1: Get existing comments
  const existingComments = await getComments();

  // Step 2: Create a new comment
  const testComment = await createComment(
    "This is a test comment from the automated test script. It supports **markdown** and @mentions."
  );

  if (!testComment) {
    console.error("❌ Test failed: Could not create comment");
    rl.close();
    return;
  }

  // Step 3: Create a reply to the new comment
  const commentId = testComment.id;
  const testReply = await createComment(
    "This is a test reply to the previous comment. #solution123",
    commentId
  );

  // Step 4: Like the comment
  if (testComment) {
    await likeComment(commentId);
  }

  // Step 5: Get updated comments to see changes
  await getComments();

  // Ask if we should delete the test comments
  const shouldDelete = await askQuestion(
    "\nDo you want to delete the test comments? (y/n): "
  );

  if (shouldDelete.toLowerCase() === "y") {
    // Delete the reply first (if exists)
    if (testReply) {
      await deleteComment(testReply.id);
    }

    // Then delete the parent comment
    if (testComment) {
      await deleteComment(commentId);
    }

    // Verify deletion
    await getComments();
  }

  console.log("\n✅ TEST COMPLETED");
  rl.close();
}

runTest().catch((error) => {
  console.error("Unhandled error:", error);
  rl.close();
});
