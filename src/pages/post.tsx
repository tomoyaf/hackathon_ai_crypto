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
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function PostPage() {
  const { connectToMetaMask } = useMetaMask();
  const readOnlyContract = contractUtils.connectReadOnlyContract();
  const [formState, setFormState] = React.useState<{
    title: string;
    description: string;
    thumbnailUrl: string;
    rvcModelUrl: string;
    price: number;
    royaltyRate: number;
    maxSupply: number;
    rule: string;
  }>({
    title: "",
    description: "",
    thumbnailUrl: "",
    rvcModelUrl: "",
    price: 100,
    royaltyRate: 5,
    maxSupply: 100,
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
    if (!contract) throw new Error("コントラクターが見つかりません");

    // 現在の価格を取得
    const addItemPrice = await contract.addItemPrice();
    const balance = await contract.signer.getBalance();
    const estimatedGas =
      await readOnlyContract.estimateGas.requestAddMintableItem(
        utils.parseEther(formState.price.toString()),
        formState.maxSupply,
        formState.royaltyRate * 100,
        { value: addItemPrice }
      );

    if (balance.lt(estimatedGas.add(addItemPrice)))
      throw new Error("残高が足りません");

    const tx = await contract.requestAddMintableItem(
      utils.parseEther(formState.price.toString()),
      formState.maxSupply,
      formState.royaltyRate * 100,
      { value: addItemPrice }
    );

    const receipt = await tx.wait();
    const voiceId = contractUtils.extractVoiceIdFromTxResult(receipt);

    if (!voiceId) throw new Error("コントラクターへの登録に失敗しました");

    return voiceId;
  };

  const errorMessageHandler = (e: any) => {
    console.error(e);
    switch (e?.code) {
      case -32603:
        return "登録に必要な残高が足りません";
      default:
        return "コントラクターへの登録に失敗しました";
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const voiceId = await toast.promise(registerToContract(), {
      loading: "コントラクターと通信中です",
      success: "コントラクターへの登録が完了しました",
      error: (err) => errorMessageHandler(err),
    });

    const res = await toast.promise(
      fetch("/api/voiceModels", {
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
          声モデルを投稿
        </k.h2>

        <k.div>
          <k.p fontSize="0.85rem" opacity="0.7">
            声モデルの作成にお困りですか？完全無料で声モデル作成代行サービスを承っておりますので、お気軽に以下のフォームからご依頼ください！
          </k.p>
          <k.a
            href="https://forms.gle/jg793nZZPaFi6oT87"
            target="_blank"
            rel="noopener noreferrer"
            fontSize="0.85rem"
            display="flex"
            gap="4px"
            color="#35d0ac"
          >
            声モデル作成代行サービス依頼フォーム
            <ArrowTopRightOnSquareIcon width="15px" />
          </k.a>
        </k.div>

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
          <k.span fontSize="0.85rem">販売価格(Matic)</k.span>
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
        </k.div>
        <k.div display="flex" flexDir="column" gap="4px">
          <k.span fontSize="0.85rem">転売還元率(%)</k.span>
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
            流通量 (0で設定すると無制限になります)
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
          <k.span fontSize="0.85rem">RVCモデル</k.span>
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
              accept=".pth"
              display="none"
              onChange={handleChangeThumbnail("rvcModelUrl", "rvc_models/")}
            />
            {formState.rvcModelUrl.length > 0 ? (
              <k.div>{formState.rvcModelUrl}</k.div>
            ) : (
              <k.div
                p="5px 16px"
                fontSize="0.85rem"
                borderRadius="8px"
                bg="linear-gradient(175deg, rgba(9,40,54,1) 0%, rgba(9,34,52,1) 100%)"
              >
                RVCモデルをアップロード
              </k.div>
            )}
          </k.label>

          <k.label display="flex" flexDir="column" gap="4px" m="12px 0 0">
            <k.span fontSize="0.85rem">あなたの声の利用規約</k.span>
            <k.textarea
              p="4px 8px"
              borderRadius="4px"
              color="#2e3855"
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

        {/* metamask連携とcontractへの登録処理のデバッグボタン 削除してもよし！ */}

        {/* <k.button
          type="button"
          borderRadius="8px"
          bg="linear-gradient(175deg, rgba(9,40,54,1) 0%, rgba(9,34,52,1) 100%)"
          fontWeight="bold"
          transition="opacity ease 220ms"
          _hover={{
            opacity: 0.7,
          }}
          onClick={() => registerToContract()}
          p="8px 0"
        >
          test
        </k.button> */}

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

      <k.div
        width="500px"
        maxWidth="90vw"
        p="32px 0"
        display="flex"
        justify="center"
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
      </k.div>
    </k.div>
  );
}

PostPage.getLayout = (page: any) => <Layout>{page}</Layout>;
