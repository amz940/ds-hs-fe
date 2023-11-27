import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Textarea,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import {useImmer} from "use-immer";
import {useEffect} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

export function HsEdit() {
    const [list, updateList] = useImmer([]);
    const {id} = useParams();
    const {isOpen, onClose, onOpen} = useDisclosure();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        axios.get("/api/hospital/id/" + id).then((r) => updateList(r.data))
    }, []);

    const hour = () => {
        const result = [];
        for (let i = 0; i < 25; i++) {
            result.push(<option value={i} key={i}>{i}</option>);
        }
        return result;
    }

    function handleNameChange(e) {
        updateList(r => {
            r.name = e.target.value
        })
    }

    function handleAddressChange(e) {
        updateList(r => {
            r.address = e.target.value
        })
    }

    function handlePhoneChange(e) {
        updateList(r => {
            r.phone = e.target.value
        })
    }

    function handleOpenHourChange(e) {
        updateList(r => {
            r.openHour = e.target.value
        })
    }

    function handleCloseHourChange(e) {
        updateList(r => {
            r.closeHour = e.target.value
        })
    }

    function handleOpenMinChange(e) {
        updateList(r => {
            r.openMin = e.target.value
        })
    }

    function handleCloseMinChange(e) {
        void updateList(r => {
            r.closeMin = e.target.value
        })
    }

    function handleContentChange(e) {
        updateList((draft) => {
            draft.content = e.target.value
        })
    }

    function handleHomePageChange(e) {
        updateList(r => {
            r.homePage = e.target.value
        })
    }

    function handleNightChange(e) {
        updateList(r => {
            r.nightCare = e.target.checked
        })
    }

    console.log(list.nightCare)

    function handleSubmitClick() {
        axios.put("/api/hospital/edit", {
            id: list.id,
            name: list.name,
            address: list.address,
            phone: list.phone,
            openHour: list.openHour,
            openMin: list.openMin,
            closeHour: list.closeHour,
            closeMin: list.closeMin,
            content: list.content,
            homePage: list.homePage,
            nightCare: list.nightCare


        }).then(() => {
            toast({
                description: "수정이 완료되었습니다.",
                status: "success"
            });
            navigate(-1)
        }).catch(() => {
            toast({
                description: "문제가 발생하였습니다.",
                status: "error",
            })
        }).finally(() => onClose)
    }


    return (
        <Box>
            <Card>
                <CardHeader>
                    <Heading>병원 정보 수정</Heading>
                </CardHeader>
                <CardBody>
                    <FormControl>
                        <FormLabel>병원명</FormLabel>
                        <Input value={list.name} onChange={handleNameChange}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>병원 주소</FormLabel>
                        <Input value={list.address} onChange={handleAddressChange}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>전화번호</FormLabel>
                        <Input value={list.phone} onChange={handlePhoneChange}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>오픈시간</FormLabel>
                        <Flex>
                            <FormLabel>시간</FormLabel>
                            <Select onChange={handleOpenHourChange} w={"sm"} placeholder="시간"
                                    value={list.openHour} defaultValue={0}>
                                {hour()}
                            </Select>
                            <FormLabel>분</FormLabel>
                            <Select defaultValue={0} onChange={handleOpenMinChange} value={list.openMin} w={"sm"}
                                    placeholder="분">
                                <option value={0}>00</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={40}>40</option>
                                <option value={50}>50</option>
                                <option value={60}>60</option>
                            </Select>
                        </Flex>
                    </FormControl>
                    <FormControl>
                        <FormLabel>마감시간</FormLabel>
                        <Flex>
                            <FormLabel>시간</FormLabel>
                            <Select value={list.closeHour} defaultValue={0} onChange={handleCloseHourChange}
                                    w={"sm"}
                                    placeholder="시간">
                                {hour()}
                            </Select>
                            <FormLabel>분</FormLabel>
                            <Select value={list.closeMin} defaultValue={0} w={"sm"} placeholder="분"
                                    onChange={handleCloseMinChange}>
                                <option value={0}>00</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={40}>40</option>
                                <option value={50}>50</option>
                                <option value={60}>60</option>
                            </Select>
                        </Flex>
                    </FormControl>
                    <FormControl>
                        <FormLabel>상세정보</FormLabel>
                        <Textarea value={list.content} onChange={handleContentChange}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>홈페이지</FormLabel>
                        <Input value={list.homePage} onChange={handleHomePageChange}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>야간영업</FormLabel>
                        <Checkbox value={list.nightCare} onChange={handleNightChange}>야간영업을 하시면 체크 해주세요</Checkbox>
                    </FormControl>
                </CardBody>
                <CardFooter>
                    <Button onClick={onOpen} colorScheme="twitter">저장</Button>
                    <Button onClick={() => navigate(-1)}>취소</Button>
                </CardFooter>
            </Card>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>저장</ModalHeader>
                    <ModalCloseButton/>

                    <ModalBody>저장 하시겠습니까?</ModalBody>

                    <ModalFooter>
                        <Button onClick={onClose}>닫기</Button>
                        <Button onClick={handleSubmitClick} colorScheme="twitter">
                            저장
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}