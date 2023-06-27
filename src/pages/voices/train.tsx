import { k } from "@kuma-ui/core";
import { Layout } from "@/components";
import { useFeedItems } from "@/hooks/useFeedItems";
import { useMetaMask } from "@/hooks/useContract";
import * as contractUtils from "@/utils/contractFrontend";
import React from "react";
import { toast } from "react-hot-toast";
import { utils } from "ethers";
import { useRouter } from "next/navigation";
import {
  ArrowTopRightOnSquareIcon,
  MicrophoneIcon,
  MusicalNoteIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function PostPage() {
  const { status } = useSession();
  React.useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  const { connectToMetaMask } = useMetaMask();
  const readOnlyContract = contractUtils.connectReadOnlyContract();
  const [formState, setFormState] = React.useState<{
    title: string;
    description: string;
    thumbnailUrl: string;
    audioUrl: string;
    price: number;
    royaltyRate: number;
    maxSupply: number;
    rule: string;
  }>({
    title: "",
    description: "",
    thumbnailUrl: "",
    audioUrl: "",
    price: 100,
    royaltyRate: 5,
    maxSupply: 3,
    rule: `・本モデルに伴ういかなる損害についても、当方は一切の責任を負いません。
・公序良俗に反した利用の禁止。`,
  });

  const router = useRouter();

  // 登録料取得
  const [addItemPrice, setAddItemPrice] = React.useState("");
  React.useEffect(() => {
    (async () => {
      const price = await readOnlyContract.addItemPrice();
      setAddItemPrice(utils.formatEther(price));
    })();
  }, []);

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

  // コントラクターへの登録
  const registerToContract = async () => {
    const { contract } = await connectToMetaMask();

    // 現在の価格を取得
    const addItemPrice = await contract.addItemPrice();
    const gasPrice = await contractUtils.calcGasPrice();
    const tx = await contract.requestAddMintableItem(
      utils.parseEther(formState.price.toString()),
      formState.maxSupply,
      formState.royaltyRate * 100,
      {
        value: addItemPrice,
        type: 2, // EIP-1559
        maxFeePerGas: gasPrice,
      }
    );

    const receipt = await tx.wait();
    const voiceId = contractUtils.extractVoiceIdFromTxResult(receipt);

    if (voiceId == null)
      throw new Error("コントラクターへの登録に失敗しました");

    return voiceId;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const voiceId = await toast.promise(registerToContract(), {
        loading: "コントラクターと通信中です",
        success: "コントラクターへの登録が完了しました",
        error: (e) => {
          switch (e?.code) {
            case -32603:
              return "登録に必要な残高が足りません";
            default:
              return e?.message ?? "コントラクターへの登録に失敗しました";
          }
        },
      });

      const res = await toast.promise(
        fetch("/api/voiceModels/trainer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formState, voiceId }),
        }),
        {
          loading: "アップロード中です",
          success: "アップロードが完了しました",
          error: "アップロードに失敗しました",
        }
      );
      const savedVoiceModel = (await res.json())?.savedVoiceModel;

      if (savedVoiceModel?.id != null) {
        router.push(`/voices/${savedVoiceModel.id}`);
      }
    } catch (error) {
      console.error(error);
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
          声モデルを作成
        </k.h2>

        <k.p fontSize="0.85rem" opacity="0.7">
          サービス側で声モデルを作成します。声モデルの作成には1時間程度かかる可能性がありますので、しばらくお待ちください。
        </k.p>

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
          <k.span fontSize="0.85rem">販売価格(MATIC)</k.span>
          <k.input
            type="number"
            p="4px 8px"
            borderRadius="4px"
            color="#2e3855"
            value={formState.price}
            step={0.01}
            onChange={(e) =>
              setFormState((s) => ({
                ...s,
                price: +e.target.value,
              }))
            }
            required
          />
          <k.span fontSize="0.85rem" opacity="0.7">
            1MATICは約85円（2023/06/19時点）
          </k.span>
        </k.div>
        <k.div display="flex" flexDir="column" gap="4px">
          <k.span fontSize="0.85rem">二次流通還元率(%)</k.span>
          <k.input
            type="number"
            p="4px 8px"
            borderRadius="4px"
            color="#2e3855"
            value={formState.royaltyRate}
            onChange={(e) =>
              setFormState((s) => ({
                ...s,
                royaltyRate: +e.target.value,
              }))
            }
            required
            min={0}
            max={100}
          />
        </k.div>
        <k.div display="flex" flexDir="column" gap="4px">
          <k.span fontSize="0.85rem">
            販売個数(0で設定すると無制限になります)
          </k.span>
          <k.input
            type="number"
            p="4px 8px"
            borderRadius="4px"
            color="#2e3855"
            value={formState.maxSupply}
            onChange={(e) =>
              setFormState((s) => ({
                ...s,
                maxSupply: +e.target.value,
              }))
            }
            required
            min={0}
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
          <k.span fontSize="0.85rem">音声ファイル</k.span>
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
              onChange={handleChangeThumbnail("audioUrl", "train_voices/")}
            />
            {formState.audioUrl.length > 0 ? (
              <k.div>{formState.audioUrl}</k.div>
            ) : (
              <k.div
                p="5px 16px"
                fontSize="0.85rem"
                borderRadius="8px"
                bg="linear-gradient(175deg, rgba(9,40,54,1) 0%, rgba(9,34,52,1) 100%)"
              >
                音声をアップロード
              </k.div>
            )}
          </k.label>

          <k.label display="flex" flexDir="column" gap="4px" m="12px 0 0">
            <k.span fontSize="0.85rem">あなたの声の利用規約</k.span>
            <k.textarea
              p="4px 8px"
              borderRadius="4px"
              color="#2e3855"
              fontSize="0.85rem"
              minHeight="120px"
              value={formState.rule}
              onChange={(e) => {
                setFormState((s) => ({
                  ...s,
                  rule: e.target.value,
                }));
              }}
              required
            />
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
          登録{addItemPrice ? ` (${addItemPrice} MATIC)` : ""}
        </k.button>
      </k.form>

      <k.div mt="16px" width="500px" maxWidth="90vw">
        <k.p fontSize="0.85rem" opacity="0.7">
          現在VOICE CHAINはβテスト中です。
        </k.p>
        <k.p fontSize="0.85rem" opacity="0.7">
          Polygon Mumbai
          Testnetに接続した上でMetaMaskを設定していただく必要があります。
        </k.p>
        <k.p fontSize="0.85rem" opacity="0.7">
          正式版リリース時に
        </k.p>
      </k.div>

      <k.div
        width="500px"
        maxWidth="90vw"
        p="32px 0"
        display="flex"
        flexDir="column"
        alignItems="center"
        gap="18px"
      >
        <Link
          href="/originalMusics/post"
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
          曲を投稿する <MusicalNoteIcon width="18px" />
        </Link>
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
          声モデルを投稿する <PlusIcon width="18px" />
        </Link>
      </k.div>
    </k.div>
  );
}

PostPage.getLayout = (page: any) => <Layout>{page}</Layout>;
