import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
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
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider";
import { CardMedia } from "@mui/material";

export function CSView() {
  const [cs, setCs] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const navigate = useNavigate();

  const { id } = useParams();

  const { hasAccess, authCheck } = useContext(LoginContext);

  useEffect(() => {
    axios.get("/api/cs/id/" + id).then((response) => setCs(response.data));
  }, []);

  if (cs === null) {
    return <Spinner />;
  }

  function handleDelete() {
    axios
      .delete("/api/cs/remove/" + id)
      .then((response) => {
        toast({
          description: id + "번 공지글이 삭제되었습니다.",
          status: "success",
        });
        navigate("/home/cs");
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose());
  }

  return (
    <Box className="mx-auto max-w-screen-full">
      <h1 className="text-4xl font-semibold mb-8">공 지 사 항</h1>
      <Box p={8} bg="orange.100">
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
          p="6"
          className="flex flex-col md:flex-row w-full"
        >
          <Box mb={{ base: 8, md: 0 }} width={{ base: "100%", md: "100%" }}>
            <Card>
              <CardHeader>
                <Heading size="xl">{cs.id}번 글 보기</Heading>
              </CardHeader>
              <CardBody>
                <Box mb={5}>
                  <p className="font-dongle text-5xl text-gray-500">제 목</p>
                  <Input
                    w="600px"
                    style={{ borderColor: "#f1efef" }}
                    value={cs.csTitle}
                    readOnly
                  />
                </Box>
                {/*<Box mb={5} readOnly>*/}
                {/*  <span className="font-dongle text-5xl text-gray-500">*/}
                {/*    본 문*/}
                {/*  </span>*/}
                {/*  <div style={{ whiteSpace: "pre-line" }}>*/}
                {/*    {cs.csContent}*/}
                {/*    /!* 이미지 출력 *!/*/}
                {/*    {cs.files.map((file) => (*/}
                {/*      <Card key={file.id} my={5}>*/}
                {/*        <CardBody>*/}
                {/*          <Image*/}
                {/*            width="40%"*/}
                {/*            mb="5"*/}
                {/*            src={file.url}*/}
                {/*            alt={file.fileName}*/}
                {/*          />*/}
                {/*        </CardBody>*/}
                {/*      </Card>*/}
                {/*    ))}*/}
                {/*  </div>*/}
                {/*</Box>*/}

                <Box mb={5} className="flex items-center">
                  <span className="mr-4 font-dongle text-3xl text-gray-500">
                    작성자 :
                  </span>
                  <Input value={cs.csWriter} readOnly w="150px" />
                  <span className="ml-10 mr-4 font-dongle text-3xl text-gray-500">
                    카테고리 :
                  </span>
                  <Input value={cs.csCategory} readOnly w="150px" />
                </Box>
                <Box>
                  <span className="font-dongle text-3xl text-gray-500 mr-4">
                    작성일시 :
                  </span>
                  <Input value={cs.ago} readOnly w="120px" />
                </Box>
              </CardBody>

              <CardFooter justifyContent="flex-end">
                {(hasAccess(cs.csWriter) || authCheck() === "admin") && (
                  <Box>
                    <button
                      onClick={() => navigate("/home/cs/csEdit/" + cs.id)}
                      className="mr-4 px-8 py-2 rounded-md relative h-12 w-40 overflow-hidden text-indigo-600 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm before:bg-indigo-500 before:duration-300 before:ease-out hover:text-white hover:before:h-40 hover:before:w-40 hover:before:opacity-80 font-dongle font-semibold"
                    >
                      <span className="relative z-10  text-4xl">
                        수 정 하 기
                      </span>
                    </button>
                    <button
                      onClick={onOpen}
                      className="ml-10 rounded-md relative h-12 w-40 overflow-hidden text-indigo-600 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm before:bg-indigo-500 before:duration-300 before:ease-out hover:text-white hover:before:h-40 hover:before:w-40 hover:before:opacity-80 font-dongle font-semibold "
                    >
                      <span className="relative z-10  text-4xl">
                        삭 제 하 기
                      </span>
                    </button>
                  </Box>
                )}
              </CardFooter>
            </Card>
          </Box>

          {/* 공지글 삭제 모달 */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>삭제 확인</ModalHeader>
              <ModalCloseButton />
              <ModalBody>삭제 하시겠습니까?</ModalBody>

              <ModalFooter>
                <Button onClick={onClose}>취소</Button>
                <Button onClick={handleDelete} colorScheme="red">
                  삭제
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </Box>
  );
}

export default CSView;
