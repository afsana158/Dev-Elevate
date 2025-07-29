import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import Input from './Input.tsx'
import Select from "./Select.tsx";
import RTE from "./RTE.tsx";

interface PostProps {
  title?: string;
  slug?: string;
  content?: string;
  published?: boolean;
  tags?: string[];
}

interface FormInputs {
  title: string;
  slug: string;
  content: string;
  status: "active" | "inactive";
  tags: string[] | string;
}

interface PostResponse{
  success: boolean;
  message: string;
  news: {
    _id: string;
    title: string;
    slug: string;
    content: string;
    published: boolean;
    tags: string[];
    createdAt: string,
    updatedAt: string
  }
}

interface AddPostProps {
  post?: PostProps;
}

const AddPost: React.FC<AddPostProps> = ({ post }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { state } = useAuth();
  const user = state.user;
  const token = state.sessionToken;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      title: post?.title || "Title",
      slug: post?.slug || "slug",
      content: post?.content || "",
      status: post?.published ? "active" : "inactive",
      tags: post?.tags || [],
    },
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("data", data);

      if (!user || !token) {
        alert("You must be logged in to add a post.");
        return;
      }

      const processedTags = typeof data.tags === "string"
        ? data.tags.split(",").map((tag: string) => tag.trim()) 
        : data.tags;

      const response = await axios.post<PostResponse>(
        `${import.meta.env.VITE_API_URL}/posts`,
        {
          title: data.title,
          slug: data.slug,
          content: data.content,
          published: data.status === "active",
          tags: data.tags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Post created successfully:", response.data);
      toast.success("Post created successfully!");
      navigate(`/news/${response.data.news._id}`);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const slugTransform = useCallback((value: string) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && typeof value.title === "string") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue, slugTransform]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">
          {post ? "Update Blog Post" : "Create Blog Post"}
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* Left column - main content */}
          <div className="flex-1">
            <Input
              label="Title"
              placeholder="Enter post title"
              className="mb-4"
              {...register("title", { required: true })}
            />
            <Input
              label="Slug"
              placeholder="Auto-generated or custom slug"
              className="mb-4"
              {...register("slug", { required: true })}
              onInput={(e) =>
                setValue("slug", slugTransform(e.currentTarget.value), {
                  shouldValidate: true,
                })
              }
            />
            {control && (
              <RTE
                label="Content"
                name="content"
                control={control}
                // defaultValue={getValues("content")}
              />
            )}
          </div>

          <div className="w-full lg:w-[320px] space-y-4">
            <Input
              label="Tags (comma separated)"
              placeholder="Enter tags"
              className="mb-4"
              {...register("tags", {
                required: false,
                validate: (value) => {
                  if (value && typeof value === "string") {
                    return value.split(",").length <= 5 || "Max 5 tags allowed";
                  }
                  return true;
                },
              })} />
            <Select
              label="Status"
              options={["active", "inactive"]}
              {...register("status", { required: true })}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl shadow transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Uploading...{" "}
                </>
              ) : post ? (
                "Update"
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
