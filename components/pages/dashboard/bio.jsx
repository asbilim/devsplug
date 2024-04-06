"use client";
import React, { useState } from "react";
import MarkdownEditor from "@uiw/react-markdown-editor";
import ActionButton from "@/components/buttons/action-button";
import { toast } from "sonner";
import { editMotivation } from "@/data/user-edit";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const mdStr = `
# Markdown Tutorial | don't worry we style it for you , just create a skeleton of your bio

## let's start with this example 

# Your Name Here

![Profile Picture](https://images.unsplash.com/photo-1584395630827-860eee694d7b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60)

## About Me
Hello! I'm **Your Name Here**, a software developer with a passion for creating impactful web applications. I specialize in full-stack development, with a keen interest in technologies such as React, Node.js, and MongoDB.

## Skills
- **Programming Languages**: JavaScript, Python, Java
- **Frameworks/Libraries**: React, Express, Django
- **Tools**: Git, Docker, Jenkins

## Projects
- **[Project Name](#)**: A brief description of your project. What problems does it solve? What technologies did you use?
- **[Another Project](#)**: Another short project description. Highlight any unique challenges faced and the solutions you came up with.

## Contact Me
- **GitHub**: [YourGitHub](https://github.com/YourGitHub)
- **LinkedIn**: [YourLinkedIn](https://www.linkedin.com/in/YourLinkedIn)
- **Website**: [YourWebsite.com](http://YourWebsite.com)

> *"Your favorite quote can go here!"*

Feel free to connect with me if you're interested in collaborating on projects or if you have any questions. I'm always open to discussing new ideas and opportunities!

*You can edit it as you want and add more stuff*

## Headings
Headings are created by placing a hash (#) before your text. The number of hashes denotes the level of the heading.
\`\`\`
# H1
## H2
### H3
#### H4
##### H5
###### H6
\`\`\`

## Emphasis
Emphasis can be added with italics and bold text.
- *Italics* are created with single asterisks or underscores.
- **Bold** text is created with double asterisks or underscores.
\`\`\`
*This text* is italic
**This text** is bold
\`\`\`

## Lists
Lists come in two flavors: unordered and ordered.

### Unordered
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

\`\`\`
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
\`\`\`

### Ordered
1. Item 1
2. Item 2
3. Item 3

\`\`\`
1. Item 1
2. Item 2
3. Item 3
\`\`\`

## Links
Links are created by wrapping link text in brackets [ ], and the URL in parentheses ( ).
\`\`\`
[Google](https://www.google.com)
\`\`\`

## Images
Images are similar to links, but they include a preceding exclamation mark (!), followed by the alt text in brackets, and the path or URL to the image in parentheses.
\`\`\`
![This is an image](https://example.com/image.png)
\`\`\`

## Code
Inline code is wrapped with backticks (\`), and blocks of code are wrapped with triple backticks or indented with four spaces.

\`\`\`
This is an inline \`code\` example.
\`\`\`

\`\`\`\`
This is a block of code
\`\`\`\`

## Blockquotes
Blockquotes are created by preceding text with a greater than sign (>).
\`\`\`
> This is a blockquote.
\`\`\`

Remember, the effectiveness of these markdown elements can vary slightly depending on the platform (GitHub, Discord, etc.), but these basics will get you started on most.
`;

export default function BioEdit() {
  const { data: session, update } = useSession();
  const [markdown, setMarkdown] = useState(mdStr);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dat = session?.user?.motivation ? session.user.motivation : null;

    dat && setMarkdown(dat);
  }, [session]);

  const router = useRouter();

  const onsubmit = async () => {
    setLoading(true);

    try {
      const result = await editMotivation(
        { motivation: markdown },
        session?.accessToken
      );
      console.log(result);
      result.success && update();
      toast("Modifying bio status", {
        description: result.error || result.success || result.detail,
        action: {
          label: result.detail ? "retry" : "View as visitor",
          onClick: () => {
            result.detail
              ? onsubmit()
              : router.push("/user/" + session.user.username);
          },
        },
      });
    } catch (error) {
      toast("Modifying bio failed", {
        description: error.message,
        action: {
          label: "retry",
          onClick: () => onsubmit(),
        },
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center w-full flex-col px-4 min-h-screen">
      <div className="md:grid md:grid-cols-2 flex flex-col my-8  w-full max-w-6xl lg:h-[60vh] gap-12 ">
        <MarkdownEditor
          value={markdown}
          onChange={(value, viewUpdate) => setMarkdown(value)}
          className="h-[60vh]"
        />
        <MarkdownEditor.Markdown
          source={markdown}
          className="border-2 h-[60vh] overflow-auto"
        />
      </div>
      <div className="flex w-full justify-start max-w-6xl">
        <ActionButton isLoading={loading} onclick={() => onsubmit()} variant="">
          Save new bio
        </ActionButton>
      </div>
    </div>
  );
}
