import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useNumberInput,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { DrugComment } from "./DrugComment";
import { LoginContext } from "../../component/LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";

function CartContainer({ cart, onClick }) {
  const { getInputProps, getDecrementButtonProps, getIncrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 0,
      min: 0,
      max: 10,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  if (cart === null) {
    return <Spinner />;
  }

  return (
    <Flex>
      <HStack maxW="150px">
        <Button {...dec}>-</Button>
        <Input {...input} />
        <Button {...inc}>+</Button>
      </HStack>
      <Button
        variant="ghost"
        onClick={() => onClick(input.value)}
        colorScheme="pink"
        bg="#ffd6d1"
      >
        장바구니
      </Button>
    </Flex>
  );
}

function LikeContainer({ like, onClick }) {
  if (like === null) {
    return <Spinner />;
  }
  return (
    <Button variant="ghost" size="xl" onClick={onClick}>
      {/*<FontAwesomeIcon icon={faThumbsUp} size="2xl" />*/}

      {like.like && (
        <Text>
          <FontAwesomeIcon icon={fullHeart} size="2xl" color="pink" />
        </Text>
      )}
      {like.like || (
        <Text>
          <FontAwesomeIcon icon={emptyHeart} size="2xl" color="pink" />
        </Text>
      )}
      <Text fontSize="2xl">{like.countLike}</Text>
    </Button>
  );
  e;
}

export function DrugView() {
  const [like, setLike] = useState(null);

  const [drug, setDrug] = useState(null);
  const [cart, setCart] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const { isAdmin } = useContext(LoginContext);
  const { id } = useParams();

  useEffect(() => {
    axios.get("/api/drug/id/" + id).then((response) => setDrug(response.data));
  }, []);

  useEffect(() => {
    axios
      .get("/api/drug/cart/drugId/" + id)
      .then((response) => setCart(response.data));
  }, []);

  useEffect(() => {
    axios
      .get("/api/drug/like/drug/" + id)
      .then((response) => setLike(response.data));
  }, []);

  if (drug === null) {
    return <Spinner />;
  }

  const imageLength = drug.files.length;

  function handleDelete() {
    axios
      .delete("/api/drug/remove/" + id)
      .then((response) => {
        toast({
          description: id + "번 게시물이 삭제되었습니다.",
          status: "success",
        });
        navigate("/drug/drugList/");
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose());
  }

  function handleCart(quantity) {
    axios
      .post("/api/drug/cart", { drugId: drug.id, quantity })
      .then((response) => {
        setCart(response.data);
        toast({
          description: "장바구니에 담는중입니다.",
          status: "success",
        });
      })
      .catch((error) => {
        toast({
          description: " 장바구니에 넣는 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose);
  }

  function handleLike() {
    axios
      .post("/api/drug/like", { drugId: drug.id })
      .then((response) => setLike(response.data))
      .catch(() => console.log("안됨"))
      .finally(() => console.log("끝"));
  }

  function handleShowImage(next) {
    setCurrentImageIndex(
      (currentImageIndex + next + imageLength) % imageLength,
    );
  }

  function handleShowImageStatic(index) {
    setCurrentImageIndex(index);
  }

  return (
    <Box marginLeft="300px" width="800px">
      <Flex justifyContent="space-between">
        <Heading size="xl">{drug.id}번째 영양제</Heading>
        {/*좋아요 버튼*/}
        <LikeContainer like={like} onClick={handleLike} />
      </Flex>
      <Flex alignItems="center">
        {/*<Button onClick={() => handleShowImage(-1)}>이전</Button>*/}
        <Box position="relative" w="500px" h="500px" my="10">
          {drug.files.map((file, index) => (
            <Box
              position="absolute"
              key={file.id}
              my="5px"
              border="3px solid black"
              width="500px"
              height="500px"
              opacity={index === currentImageIndex ? 1 : 0}
              transition="opacity 0.5s"
            >
              <Image width="100%" src={file.url} alt={file.name} />
            </Box>
          ))}
        </Box>
        {/*<Button onClick={() => handleShowImage(1)}>다음</Button>*/}
      </Flex>
      <Flex gap={2}>
        {drug.files.map((file, index) => (
          <Box
            opacity={index === currentImageIndex ? 1 : 0.5}
            w={20}
            h={20}
            key={file.id}
            onClick={() => handleShowImageStatic(index)}
          >
            <Image width="100%" src={file.url} alt={file.name} />
          </Box>
        ))}
      </Flex>

      <FormControl>
        <FormLabel>제품명</FormLabel>
        <Input value={drug.name} readOnly />
        <FormHelperText>{drug.content}</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>기능</FormLabel>
        <Input value={drug.func} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>가격</FormLabel>
        <Input value={drug.price} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>배송비</FormLabel>
        <Input value={drug.shipping} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>등록 일자</FormLabel>
        <Input value={drug.inserted} readOnly />
      </FormControl>

      {/*장바구니*/}
      <Flex>
        <CartContainer cart={cart} onClick={handleCart} />
      </Flex>

      {isAdmin() && (
        <>
          <Button
            colorScheme="pink"
            onClick={() => navigate("/drug/edit/" + id)}
          >
            수정
          </Button>
          <Button colorScheme="purple" onClick={onOpen}>
            삭제
          </Button>
        </>
      )}

      {/* 삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <DrugComment drugId={drug.id} />
    </Box>
  );
}
