"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import SyntaxHighlighter from "react-syntax-highlighter";
import html2canvas from "html2canvas";
import { CircleChevronRight } from "lucide-react";
import { toast } from "sonner";
import { submitCodeImage } from "@/data/add-problem";
import {
  docco,
  dracula,
  a11yLight,
  a11yDark,
  agate,
  dark,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import supportedLanguages from "react-syntax-highlighter/dist/cjs/languages/hljs/supported-languages";
import { useSession } from "next-auth/react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import uuid from "react-uuid";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getSingleProblemQuizStatus } from "@/data/get-problems";
import ActionButton from "../buttons/action-button";
import { answerQuestion } from "@/data/add-problem";
import { createProblemQuiz } from "@/data/add-problem";
import { getProblemScore } from "@/data/get-problems";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Smile, Camera, SendHorizontal } from "lucide-react";
export default function ChallengeSolve({ problem, quiz }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const { data: session, update } = useSession();

  const onclick = async () => {
    const slug = problem.slug;
    const token = session?.accessToken;
    if (!token) {
      return toast("Please we are still fetching your informations", {
        description:
          "The system is still fetching your datas , wait few seconds and try again",

        action: {
          label: "retry",
          onClick: () => console.log("Undo"),
        },
      });
    }
    try {
      const result = await getSingleProblemQuizStatus(token, {
        problem_slug: slug,
      });

      const res = await createProblemQuiz(
        { problem_slug: problem.slug },
        session?.accessToken
      );

      setLoading(true);
      setQuizzes(result);
      setShowQuiz(!showQuiz);
      setLoading(false);
    } catch (e) {
      return toast("Please we are still fetching your informations", {
        description:
          "The system is still fetching your datas , wait few seconds and try again",

        action: {
          label: "retry",
          onClick: () => console.log("Undo"),
        },
      });
    }
  };

  return (
    <div className="flex px-12 my-24 items-center justify-center flex-col gap-24">
      <div className="flex gap-12  w-full max-w-6xl">
        <Button className="w-full">Back to problem</Button>
        <Button variant="secondary" className="w-full border-4">
          Submit my answer
        </Button>
      </div>
      <div className="flex gap-12  w-full max-w-6xl flex-col">
        <h1 className="text-4xl font-bold p-6 text-center border-dashed   border-4">
          {problem?.title}
        </h1>
      </div>
      <CodeForm quiz={quiz} />
      {showQuiz && (
        <QuizLayout
          quiz={quizzes}
          token={session?.accessToken}
          slug={problem.slug}
          setquiz={setQuizzes}
        />
      )}

      {showQuiz ? (
        <ActionButton
          variant=""
          className="border-2"
          icon={CircleChevronRight}
          iClassName="mx-4"
          isLoading={loading}
          onclick={() => alert("coming soon")}
        >
          View the leaderboard
        </ActionButton>
      ) : (
        <ActionButton
          variant=""
          className="border-2"
          icon={CircleChevronRight}
          iClassName="mx-4"
          isLoading={loading}
          onclick={() => onclick()}
        >
          Take the quiz and submit your answer
        </ActionButton>
      )}
    </div>
  );
}

const CodeForm = () => {
  const { register, handleSubmit, watch } = useForm();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [style, setStyle] = useState(docco);
  const { data: session } = useSession();
  const { user } = session || false;
  const imageRef = useRef(null);
  const unique_id = uuid();

  const switchStyle = (styleName) => {
    switch (styleName) {
      case "docco":
        return docco;
      case "dracula":
        return dracula;
      case "a11yLight":
        return a11yLight;
      case "a11yDark":
        return a11yDark;
      case "agate":
        return agate;
      case "dark":
        return dark;
      default:
        return docco;
    }
  };

  const onSubmit = (data) => {
    setCode(data.codeValue);
    console.log(data);
  };

  const onclick = () => {
    if (imageRef.current) {
      html2canvas(imageRef.current, {
        scale: 4,
      }).then((canvas) => {
        // Convert the canvas to an image
        const image = canvas.toDataURL("image/png");
        // Create a link to trigger the download
        const link = document.createElement("a");
        link.href = image;
        link.download = user ? user.username + "-" + unique_id : unique_id;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "codeValue") {
        setCode(value.codeValue);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form
      className="grid gap-6 w-full max-w-6xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Textarea
        defaultValue={code}
        className="min-h-[15rem]"
        placeholder="Paste your code here"
        onValueChange={(value) => setCode(value)}
        {...register("codeValue", { required: true })}
      />
      <div className="flex">
        <Select
          {...register("language", { required: true })}
          onValueChange={(value) => {
            setLanguage(value);
            console.log(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              {supportedLanguages.map((language, i) => (
                <SelectItem value={language} key={i + ""}>
                  {language}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          {...register("style", { required: true })}
          onValueChange={(value) => {
            setStyle(switchStyle(value));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose style" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Styles</SelectLabel>
              <SelectItem value="docco">Docco</SelectItem>
              <SelectItem value="dracula">Dracula</SelectItem>
              <SelectItem value="a11yLight">A11y Light</SelectItem>
              <SelectItem value="a11yDark">A11y Dark</SelectItem>
              <SelectItem value="agate">Agate</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input placeholder={`enter a name default:${unique_id}`} />
        <Button type="submit" onClick={() => onclick()}>
          Generate
        </Button>
      </div>
      <div
        className="flex w-full flex-col image  bg-primary p-4"
        ref={imageRef}
      >
        <div className="flex justify-between   p-3 rounded-lg">
          <h2 className="font-bold text-secondary">Devsplug</h2>
          <h4 className="font-medium text-secondary text-xs">
            code by {user ? user.username : "loading..."}
          </h4>
        </div>
        <SyntaxHighlighter
          language={language}
          style={style}
          className="w-full"
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </form>
  );
};

const QuizLayout = ({ quiz, token, slug, setquiz }) => {
  const size = quiz?.length;
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(false);
  const viewScore = async () => {
    setLoading(true);
    try {
      const result = await getProblemScore(token, { problem_slug: slug });

      setScore(result.score);
    } catch (e) {
      return toast("Something went wrong", {
        description: "we are having a problem fetching your score",
        action: {
          label: "retry",
          onClick: () => viewScore(),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  function findNextQuestionId(questions) {
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].is_submitted) {
        return questions[i].id;
      }
    }
    return null;
  }

  const currentQuestionId = findNextQuestionId(quiz);

  const getButtonState = (item) => {
    if (item.id === currentQuestionId) return "current";
    return item.is_submitted ? "done" : "coming";
  };

  const renderCurrentQuestion = () => {
    const currentQuestion = quiz.find((q) => q.id === currentQuestionId);

    return currentQuestion ? (
      <RenderQuestion
        quiz={quiz}
        content={currentQuestion}
        question_id={currentQuestion.id}
        token={token}
        slug={slug}
        setquiz={setquiz}
      />
    ) : (
      <div className="flex flex-col gap-6 min-w-lg w-full">
        <Alert>
          <Smile className="h-4 w-4" />
          <AlertTitle>Hey Hero </AlertTitle>
          <AlertDescription>
            <p>You have completed this challenge already!!</p>
            <UploadCode token={token} slug={slug} />
          </AlertDescription>
        </Alert>
        {score && (
          <p>
            this is your score: <strong>{score}</strong>
          </p>
        )}
        {!score && (
          <ActionButton
            isLoading={loading}
            variant=""
            onclick={() => viewScore()}
            iSize={25}
            iClassName="mx-4"
          >
            click to view your score
          </ActionButton>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center w-full flex-col gap-12">
      <div className="flex w-full max-w-6xl border-2 p-3">
        <div className={`grid w-full grid-cols-${size} place-items-center`}>
          {quiz.map((item) => {
            const state = getButtonState(item);
            return <QuizButton key={item.id.toString()} color={state} />;
          })}
        </div>
      </div>
      <div className="questions flex w-full max-w-6xl">
        {renderCurrentQuestion()}
      </div>
    </div>
  );
};

const QuizButton = ({ color }) => {
  const backgroundClass =
    color === "current"
      ? "border-4 p-2  animate-pulse ease-in"
      : color === "done"
      ? "bg-green-500 border-2 ring-2 ring-green-200"
      : "bg-transparent border-2";

  return (
    <div
      className={`flex rounded-full w-10 h-10 cursor-pointer ${backgroundClass} `}
    ></div>
  );
};

const RenderQuestion = ({
  content,
  question_id,
  token,
  slug,
  quiz,
  setquiz,
}) => {
  const [submittable, setSubmittable] = useState(false);
  const [answerId, setAnswerId] = useState(-5);
  const [loading, setLoading] = useState(false);

  const sendAnswer = async () => {
    setLoading(true);
    if (submittable) {
      const result = await answerQuestion(
        {
          question_id: question_id,
          selected_answer_id: answerId,
          problem_slug: slug,
        },
        token
      );

      setLoading(false);
      const newquiz = await getSingleProblemQuizStatus(token, {
        problem_slug: slug,
      });
      setquiz(newquiz);
      return toast("Question processed!!", {
        description: result.success,
        action: {
          label: "I understand",
          onClick: () => console.log("Undo"),
        },
      });
    } else {
      setLoading(false);
      return toast("Please select an answer", {
        description: "You need to select an option , to submit",

        action: {
          label: "I understand",
          onClick: () => console.log("Undo"),
        },
      });
    }
  };

  console.log(content);

  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-semibold text-2xl">{content?.title}</h3>
      <RadioGroup
        className="flex flex-col gap-6 "
        onValueChange={(value) => {
          setSubmittable(true);
          setAnswerId(value);
        }}
      >
        {content?.answers?.map((answer, index) => {
          return (
            <div className="flex items-center space-x-2" key={index + ""}>
              <RadioGroupItem
                value={answer.id}
                id={`r-${answer.id}`}
                defaultValue="comfortable"
              ></RadioGroupItem>
              <Label>
                <div
                  className="!w-full min-w-[100%] prose   prose-slate dark:prose-invert"
                  style={{ margin: 0 }}
                  dangerouslySetInnerHTML={{ __html: answer.content }}
                ></div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      <div className="flex gap-4 my-12">
        <ActionButton
          className="px-12"
          onclick={() => sendAnswer()}
          isLoading={loading}
        >
          Submit
        </ActionButton>
        <Button variant="secondary">Skip</Button>
      </div>
    </div>
  );
};

const UploadCode = ({ token, slug }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setSelectedFile(file);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image_code", selectedFile);
      formData.append("problem_slug", slug);

      try {
        const result = await submitCodeImage(formData, token);

        return toast("Sending code info", {
          description: result.error || result.success || result.detail,
          action: {
            label: "Thanks",
            onClick: () => alert("thank you too :-)"),
          },
        });
      } catch (e) {
        return toast("Something went wrong", {
          description: e.message,
          action: {
            label: "retry",
            onClick: () => handleSubmit(),
          },
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col p-4 gap-6">
      <input
        type="file"
        className="w-0 h-0"
        id="code"
        accept=".png,.svg,.jpg,.jpeg"
        onChange={handleFileChange}
      />
      <label
        htmlFor="code"
        className="image bg-secondary flex items-center justify-center min-h-[35vh] bg-cover"
        style={{
          backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
        }}
      >
        {!imagePreview && <Camera size={65} />}
      </label>
      <div className="w-full max-w-2xl">
        <ActionButton
          variant=""
          onclick={() => handleSubmit()}
          icon={SendHorizontal}
          isLoading={loading}
        >
          Evaluate my code and give my score
        </ActionButton>
      </div>
    </div>
  );
};
