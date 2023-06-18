import { k } from "@kuma-ui/core";
import { Layout } from "@/components";
import React from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MicrophoneIcon } from "@heroicons/react/24/outline";

export default function PostPage() {
  const [formState, setFormState] = React.useState<{
    title: string;
    description: string;
    thumbnailUrl: string;
    url: string;
  }>({
    title: "",
    description: "",
    thumbnailUrl: "",
    url: "",
  });

  const router = useRouter();

  const handleChangeThumbnail =
    (key: string, uploadedDir: string) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ?? [];
      if (files.length === 0) {
        return;
      }

      const formData = new FormData();
      formData.append("file", files[0]);

      const res = await toast.promise(
        fetch(`/api/files?dir=${encodeURIComponent(uploadedDir)}`, {
          method: "POST",
          body: formData,
        }),
        {
          loading: "アップロード中です",
          success: "アップロードが完了しました",
          error: "アップロードに失敗しました",
        }
      );
      const filepath: string | undefined = (await res.json())?.filepath;

      if (filepath) {
        setFormState((s) => ({
          ...s,
          [key]: filepath,
        }));
      }
    };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const res = await toast.promise(
      (async () => {
        return await fetch("/api/originalMusics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        });
      })(),
      {
        loading: "アップロード中です",
        success: "アップロードが完了しました",
        error: "エラーが発生しました",
      }
    );
    const savedOriginalMusic = (await res.json())?.savedOriginalMusic;

    if (savedOriginalMusic?.id != null) {
      router.push(`/originalMusics/${savedOriginalMusic.id}`);
    }
  };

  return (
    <k.div
      overflow-y="scroll"
      display="flex"
      justify="center"
      alignItems="center"
      flexDir="column"
      p="0 0 20vh"
    >
      <k.form
        onSubmit={handleSubmit}
        display="flex"
        flexDir="column"
        gap="16px"
        width="500px"
        maxWidth="90vw"
        bg="linear-gradient(175deg, rgb(8 37 52) 0%, rgb(3 14 36) 100%)"
        borderRadius="8px"
        p="40px 44px"
        m="10vh 0 0"
      >
        <k.h2 fontSize="1.2rem" fontWeight="bold">
          曲を投稿
        </k.h2>

        <k.div display="flex" flexDir="column" gap="4px">
          <k.span fontSize="0.85rem">タイトル</k.span>
          <k.input
            type="text"
            p="4px 8px"
            borderRadius="4px"
            color="#2e3855"
            value={formState.title}
            onChange={(e) =>
              setFormState((s) => ({
                ...s,
                title: e.target.value,
              }))
            }
            required
            min={1}
          />
        </k.div>
        <k.div display="flex" flexDir="column" gap="4px">
          <k.span fontSize="0.85rem">詳細</k.span>
          <k.input
            type="text"
            p="4px 8px"
            borderRadius="4px"
            color="#2e3855"
            value={formState.description}
            onChange={(e) => {
              setFormState((s) => ({
                ...s,
                description: e.target.value,
              }));
            }}
            required
            min={1}
          />
        </k.div>
        <k.div display="flex" flexDir="column" gap="4px">
          <k.span fontSize="0.85rem">サムネ画像</k.span>
          <k.label
            cursor="pointer"
            width="fit-content"
            _hover={{
              opacity: 0.7,
            }}
          >
            <k.input
              type="file"
              accept="image/*"
              display="none"
              onChange={handleChangeThumbnail("thumbnailUrl", "images/")}
            />
            {formState.thumbnailUrl.length > 0 ? (
              <img src={formState.thumbnailUrl} />
            ) : (
              <k.div
                p="5px 16px"
                fontSize="0.85rem"
                borderRadius="8px"
                bg="linear-gradient(175deg, rgba(9,40,54,1) 0%, rgba(9,34,52,1) 100%)"
              >
                画像をアップロード
              </k.div>
            )}
          </k.label>
        </k.div>
        <k.div display="flex" flexDir="column" gap="4px">
          <k.span fontSize="0.85rem">曲ファイル</k.span>
          <k.label
            cursor="pointer"
            width="fit-content"
            _hover={{
              opacity: 0.7,
            }}
            style={{ wordBreak: "break-all" }}
          >
            <k.input
              type="file"
              accept="audio/*"
              display="none"
              onChange={handleChangeThumbnail("url", "original_musics/")}
            />
            {formState.url.length > 0 ? (
              <k.audio src={formState.url} controls />
            ) : (
              <k.div
                p="5px 16px"
                fontSize="0.85rem"
                borderRadius="8px"
                bg="linear-gradient(175deg, rgba(9,40,54,1) 0%, rgba(9,34,52,1) 100%)"
              >
                曲ファイルをアップロード
              </k.div>
            )}
          </k.label>
        </k.div>

        <k.button
          type="submit"
          borderRadius="8px"
          bg="linear-gradient(175deg, rgba(9,40,54,1) 0%, rgba(9,34,52,1) 100%)"
          fontWeight="bold"
          transition="opacity ease 220ms"
          m="8px 0 0"
          _hover={{
            opacity: 0.7,
          }}
          p="8px 0"
        >
          送信
        </k.button>
      </k.form>

      <k.div
        width="500px"
        maxWidth="90vw"
        p="32px 0"
        display="flex"
        justify="center"
      >
        <Link
          href="/post"
          style={{
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
            gap: "4px",
            border: "1px solid #bbb",
            width: "fit-content",
            borderRadius: "4px",
            padding: "4px 24px",
          }}
        >
          声モデルを投稿する <MicrophoneIcon width="18px" />
        </Link>
      </k.div>
    </k.div>
  );
}

PostPage.getLayout = (page: any) => <Layout>{page}</Layout>;
