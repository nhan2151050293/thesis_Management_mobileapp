import React, { useState, useEffect, memo, useContext } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, RefreshControl, ScrollView, TextInput, KeyboardAvoidingView, Platform, Keyboard, Animated, PanResponder, Alert } from "react-native";
import { Icon, Modal, Button } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";
import { MyUserContext } from "../../configs/Contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import HomeStyle from './Style'

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalcmtVisible, setModalcmtVisible] = useState(false);
    const [comments, setComments] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [currentCommentPage, setCurrentCommentPage] = useState(1);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newPostContent, setNewPostContent] = useState("");
    const [newCommentContent, setNewCommentContent] = useState("");
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const user = useContext(MyUserContext);
    const [modalAnimation, setModalAnimation] = useState(new Animated.Value(500));
    const [modalCommentAnimation, setModalCommentAnimation] = useState(new Animated.Value(500));
    const [miniModalVisible, setMiniModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const [editedPostContent, setEditedPostContent] = useState("");
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [postIdToEdit, setPostIdToEdit] = useState(null);
    const [miniModalVisibleComment, setMiniModalVisibleComment] = useState({});
    const [editedCommentContent, setEditedCommentContent] = useState("");
    const [editCommentModalVisible, setEditCommentModalVisible] = useState(false);
    const [commentIdToEdit, setCommentIdToEdit] = useState(null);
    const [deleteCommentModalVisible, setDeleteCommentModalVisible] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);
    const nav = useNavigation();

    const panResponderModal = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dy: modalAnimation }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (event, gestureState) => {
                if (gestureState.dy > 100) { 
                    setModalVisible(false);
                    Animated.timing(modalAnimation, {
                        toValue: 500,
                        duration: 300,
                        useNativeDriver: true,
                    }).start();
                } else {
                    Animated.spring(modalAnimation, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        if (modalVisible) {
            Animated.spring(modalAnimation, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(modalAnimation, {
                toValue: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [modalVisible]);

    useEffect(() => {
        if (modalcmtVisible) {
            Animated.spring(modalCommentAnimation, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(modalCommentAnimation, {
                toValue: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [modalcmtVisible]);

    const fetchPosts = async (page, query) => {
        if (page > 0) {
            let url = `${endpoints['posts']}?q=${query}&page=${page}`;
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem("token"); 
    
                let res = await APIs.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (page === 1)
                    setPosts(res.data.results);
                else if (page > 1)
                    setPosts(current => [...current, ...res.data.results]);
                if (res.data.next === null)
                    setCurrentPage(0);
            } catch (ex) {
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePost = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const formData = new FormData();
            formData.append("content", newPostContent);
    
            const response = await APIs.post(endpoints.posts, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 201) {
                setModalVisible(false);
                fetchPosts(1, searchQuery);
                setNewPostContent("");
            }
        } catch (error) {
        }
    };
    

    const fetchComments = async (postId, page = 1) => {
        const url = `${endpoints.comments(postId)}?page=${page}`;
        try {
            setLoadingComments(true);
            const token = await AsyncStorage.getItem("token");
            const res = await APIs.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (page === 1) {
                setComments(res.data.results || []); 
            } else {
                setComments(current => [...current, ...res.data.results]);
            }
            if (res.data.next === null) {
                setCurrentCommentPage(0);
            }
        } catch (ex) {
            if (page === 1) {
                setComments([]); 
            }
        } finally {
            setLoadingComments(false);
        }
    };

    const handlePostComment = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const formData = new FormData();
            formData.append("content", newCommentContent);
    
            const response = await APIs.post(endpoints.commentsPost(selectedPostId), formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 201) {
                fetchComments(selectedPostId, 1);
                setPosts(posts => posts.map(post =>
                    post.id === selectedPostId
                        ? { ...post, comment_count: post.comment_count + 1 }
                        : post
                ));
                setNewCommentContent("");
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );
    
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);
    

    useEffect(() => {
        fetchPosts(currentPage, searchQuery);
    }, [currentPage, searchQuery]);

    const loadMore = ({ nativeEvent }) => {
        if (!loading && isCloseToBottom(nativeEvent)) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const loadMoreComments = ({ nativeEvent }) => {
        if (!loadingComments && isCloseToBottom(nativeEvent)) {
            setCurrentCommentPage(prevPage => prevPage + 1);
            fetchComments(selectedPostId, currentCommentPage + 1);
        }
    };

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 1;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options).replace(/,/, '');
    };

    const getTimeDifference = (dateString) => {
        const postDate = new Date(dateString);
        const currentDate = new Date();
        const differenceInMs = currentDate - postDate;
        const differenceInSeconds = Math.floor(differenceInMs / 1000);

        if (differenceInSeconds < 60) {
            return `${differenceInSeconds} giây trước`;
        }

        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        if (differenceInMinutes < 60) {
            return `${differenceInMinutes} phút trước`;
        }

        const differenceInHours = Math.floor(differenceInMinutes / 60);
        if (differenceInHours < 24) {
            return `${differenceInHours} giờ trước`;
        }

        const differenceInDays = Math.floor(differenceInHours / 24);
        if (differenceInDays <= 3) {
            return `${differenceInDays} ngày trước`;
        }

        return formatDate(dateString);
    };

    const handleLike = async (postId) => {
        const url = endpoints.like(postId);
    
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await APIs.post(url, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setPosts(posts.map(post =>
                    post.id === postId ? { ...post, liked: !post.liked, like_count: post.liked ? post.like_count - 1 : post.like_count + 1 } : post
                ));
            }
        } catch (error) {
        }
    };
    
    

    const handleShowComments = async (postId) => {
        setSelectedPostId(postId);
        setCurrentCommentPage(1);
        await fetchComments(postId, 1);
        setModalcmtVisible(true);
    };

    const handleProfile = () => {
        nav.navigate('Profile');
    };

    const RenderItem = memo(({ item }) => {
        const [expanded, setExpanded] = useState(false);
        const [contentHeight, setContentHeight] = useState(0);
        const maxContentHeight = 50; 
        const timeDifference = getTimeDifference(item.created_date);
        
        const toggleExpand = () => {
            setExpanded(!expanded);
        };
    
        const handleOnLayout = (event) => {
            const { height } = event.nativeEvent.layout;
            setContentHeight(height);
        };

        const showMiniModal = user && user.id === item.user.id;

        return (
            <View key={item.id}>
                <View style={HomeStyle.account}>
                    <Image source={{ uri: item.user.avatar }} style={{ width: 40, height: 40, borderRadius: 150 }} />
                    <Text style={HomeStyle.Username}>{item.user.first_name}_{item.user.last_name}</Text>
                    {user && user.id === item.user.id && (
                        <TouchableOpacity style={HomeStyle.IconTop} onPress={() => handleOpenMniModal(item.id)}>
                            <Icon source="dots-vertical" color="#da91a4" size={30} />
                        </TouchableOpacity>
                    )}
                    {miniModalVisible[item.id] && (
                        <View style={HomeStyle.minimenu}>
                            <TouchableOpacity style={HomeStyle.minimenuIcon} onPress={() => handleOpenDeleteModal(item.id)}>
                                <Text style={HomeStyle.minimenuText}>Xóa bài viết</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={HomeStyle.minimenuIcon} onPress={() => handleOpenEditModal(item.id)}>
                                <Text style={HomeStyle.minimenuText}>Chỉnh sửa bài viết</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View style={HomeStyle.item}>
                    <Text
                        style={[HomeStyle.itemText, { maxHeight: expanded ? 'none' : maxContentHeight }]}
                        numberOfLines={expanded ? null : 9}
                        onLayout={handleOnLayout}
                    >
                        {item.content}
                    </Text>
                    {contentHeight > maxContentHeight && !expanded && (
                        <TouchableOpacity onPress={toggleExpand}>
                            <Text style={{ color: 'blue', marginTop: 5 }}>Read more</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={HomeStyle.account}>
                    <TouchableOpacity style={HomeStyle.Icon} onPress={() => handleLike(item.id)}>
                        <Icon source={item.liked ? "heart" : "heart-outline"} color="#da91a4" size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeStyle.Icon} onPress={() => handleShowComments(item.id)}>
                        <Icon source="chat-outline" color="#da91a4" size={30} />
                    </TouchableOpacity>
                </View>
                <Text style={HomeStyle.like}>{item.like_count} likes    {item.comment_count} bình luận</Text>
                <Text style={HomeStyle.like}>{timeDifference}</Text>
            </View>
        );
    });
    
    const handleDeletePost = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await APIs.delete(endpoints.delPost(postIdToDelete), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 204) {
                setPosts(posts.filter(post => post.id !== postIdToDelete));
                showAlert("Xóa bài đăng thành công");
            }
            setDeleteModalVisible(false); 
        } catch (error) {
        }
    };

    const handleOpenDeleteModal = (postId) => {
        setPostIdToDelete(postId);
        setDeleteModalVisible(true);
        setMiniModalVisible(false);
    };
    const handleCloseDeleteModal = () => {
        setDeleteModalVisible(false);
    };
    const handleOpenMniModal = (postId) => {
        setMiniModalVisible(prevState => ({
            ...prevState,
            [postId]: !prevState[postId] 
        }));
    };
    const showAlert = (message) => {
        Alert.alert(
            "Thông báo",
            message,
            { cancelable: false }
        );
    };
    
    const handleOpenEditModal = (postId) => {
        setPostIdToEdit(postId);
        setEditModalVisible(true);
        setMiniModalVisible(false);
        const post = posts.find(post => post.id === postId);
        if (post) {
            setEditedPostContent(post.content);
        }
    };

    const handleEditPost = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const formData = new FormData();
            formData.append("content", editedPostContent);
    
            const response = await APIs.patch(endpoints.delPost(postIdToEdit), formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 200) {
                setEditModalVisible(false);
                fetchPosts(1, searchQuery);
                setEditedPostContent("");
                showAlert("Chỉnh sửa bài viết thành công");
            }
        } catch (error) {
        }
    };
    
    const handleOpenMiniModalComment = (commentId) => {
        setMiniModalVisibleComment(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId] 
        }));
    };
    
    const handleOpenEditComment = async (commentId) => {
        const comment = comments.find(comment => comment.id === commentId);
        if (comment) {
            setEditedCommentContent(comment.content);
        }
        setCommentIdToEdit(commentId);
        setEditCommentModalVisible(true);
        setMiniModalVisibleComment(prevState => ({
            ...prevState,
            [commentId]: false
        }));
    };

    const handleEditComment = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const formData = new FormData();
            formData.append("content", editedCommentContent);
    
            const response = await APIs.patch(endpoints.commentsDP(commentIdToEdit), formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 200) {
                setEditCommentModalVisible(false);
                fetchComments(selectedPostId, 1);
                setEditedCommentContent("");
                showAlert("Chỉnh sửa bình luận thành công");
            }
        } catch (error) {
        }
    };
    

    const handleDeleteComment = async (commentId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await APIs.delete(endpoints.commentsDP(commentId), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 204) {
                setComments(comments.filter(comment => comment.id !== commentId));
                showAlert("Xóa bình luận thành công"); 
            }
            setDeleteCommentModalVisible(false); 
        } catch (error) {
        }
    };
    
    
    const handleOpenDeleteCommentModal = (commentId) => {
        setCommentIdToDelete(commentId);
        setDeleteCommentModalVisible(true);
    };

    const handleCloseDeleteCommentModal = () => {
        setDeleteCommentModalVisible(false);
    };

    const handleContactList = () => {
        nav.navigate('ContactList');
    };

    
    return (
        <View style={HomeStyle.container}>
            <View style={HomeStyle.TopBackGround}>
                <Text style={HomeStyle.greeting}>Home</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={HomeStyle.TopIcon}>
                        <Icon source="bell" color="#f3e5e4" size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeStyle.TopIcon} onPress={handleContactList}>
                        <Icon source="message" color="#f3e5e4" size={30} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={HomeStyle.Post} >
                <TouchableOpacity onPress={handleProfile}>
                    <Image source={{ uri: user?.avatar || 'default_avatar_url' }} style={HomeStyle.Avatar} />
                </TouchableOpacity>
                <TouchableOpacity style={HomeStyle.postButton} onPress={() => setModalVisible(true)}>
                    <Text style={HomeStyle.textPost}>Bài đăng mới....</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                onScroll={loadMore}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl onRefresh={() => fetchPosts(1, searchQuery)} refreshing={loading} />
                }
            >
                {loading && currentPage === 1 && <ActivityIndicator />}
                {posts.map(item => (
                    <RenderItem key={item.id} item={item} />
                ))}
                {loading && currentPage > 1 && <ActivityIndicator />}
            </ScrollView>
            <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
                <Animated.View
                    style={[
                        HomeStyle.modalContainer,
                        {
                            transform: [{ translateY: modalAnimation }]
                        }
                    ]}
                    {...panResponderModal.panHandlers} 
                >
                    <View style={HomeStyle.modalContent2}>
                        <Button mode="contained" onPress={handlePost} style={HomeStyle.buttonPost}>Đăng</Button>
                        <TextInput
                            multiline
                            placeholder="Nhập nội dung bài viết..."
                            value={newPostContent}
                            onChangeText={setNewPostContent}
                        />
                    </View>
                </Animated.View>
            </Modal>

            <Modal visible={modalcmtVisible} onDismiss={() => setModalcmtVisible(false)} >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={HomeStyle.modalContainer}
                    >
                        <View style={[HomeStyle.modalContent, { top: isKeyboardVisible ? '63%' : '50%' }]}>
                            <ScrollView
                                onScroll={loadMoreComments}
                                scrollEventThrottle={16}
                            >
                                {comments.map(comment => (
                                    <View key={comment.id}>
                                        <View style={HomeStyle.accountcmt}>
                                        {comment.user.id === user.id && (
                                                        <TouchableOpacity onPress={() => handleOpenMiniModalComment(comment.id)} style={HomeStyle.IconTop2} >
                                                            <Icon source="dots-vertical" color="#da91a4" size={30} />
                                                        </TouchableOpacity>
                                                    )} 
                                            <Image source={{ uri: comment.user.avatar }} style={{ width: 40, height: 40, borderRadius: 150 }} />
                                            <View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={HomeStyle.Usernamecmt}>{comment.user.first_name}_{comment.user.last_name}</Text>
                                                    
                                                    <Text style={HomeStyle.textcmttime}>{getTimeDifference(comment.created_date)}</Text>
                                                    {posts.map(post => post.id === selectedPostId && comment.user.first_name === post.user.first_name && <Text style={HomeStyle.textcmttime}>.Tác giả</Text>)}
                                                    
                                                </View>
                                                <Text style={HomeStyle.textcmt}>{comment.content}</Text>
                                            </View>
                                            {miniModalVisibleComment[comment.id] && (
                                                        <View style={HomeStyle.minimenu2}>
                                                            <TouchableOpacity style={HomeStyle.minimenuIcon} onPress={() => handleOpenEditComment(comment.id)}>
                                                                <Text style={HomeStyle.minimenuText}>Chỉnh sửa bình luận</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={HomeStyle.minimenuIcon} onPress={() => handleOpenDeleteCommentModal(comment.id)}>
                                                                <Text style={HomeStyle.minimenuText}>Xóa bình luận</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )}
                                        </View>

                                    </View>
                                ))}
                                {loadingComments && <ActivityIndicator />}
                            </ScrollView>
                            <View style={HomeStyle.comment}>
                                <Image source={{ uri: user?.avatar || 'default_avatar_url' }} style={{ width: 40, height: 40, borderRadius: 150 }} />
                                <TextInput
                                    style={HomeStyle.input}
                                    placeholder="Nhập nội dung bình luận..."
                                    value={newCommentContent}
                                    onChangeText={setNewCommentContent}
                                    multiline={true}
                                    scrollEnabled={true}
                                    maxHeight={60} 
                                />
                                <Button mode="contained" onPress={handlePostComment} style={HomeStyle.postcomment}>
                                    <Icon source="arrow-up-bold" color="#f3e5e4" size={22} />
                                </Button>
                                
                            </View>
                        </View>
                    </KeyboardAvoidingView>
            </Modal>
            <Modal visible={deleteModalVisible} onDismiss={handleCloseDeleteModal}>
                <View style={HomeStyle.modalContainer}>
                    <View style={HomeStyle.modalContent3}>
                    <Text style={HomeStyle.textPost}>Bạn có chắc chắn muốn xóa bài đăng này?</Text>
                    <View style={HomeStyle.modalActions}>
                            <Button mode="outlined" onPress={handleCloseDeleteModal} style={HomeStyle.buttonClose}>
                                <Text style={{color:'#da91a4'}}>Hủy</Text>
                            </Button>
                        <Button mode="contained" onPress={handleDeletePost} style={HomeStyle.buttonPost}>Xóa</Button>
                        </View>
                        </View>
                </View>
            </Modal>
            <Modal visible={editModalVisible} onDismiss={() => setEditModalVisible(false)}>
                <View style={HomeStyle.modalContainer}>
                <View style={HomeStyle.modalContent4}>
                    <Text style={HomeStyle.textPost}>Chỉnh sửa bài viết</Text>
                    <TextInput
                        multiline
                        placeholder="Nhập nội dung bài viết mới..."
                        value={editedPostContent}
                        onChangeText={setEditedPostContent}
                        style={HomeStyle.input2}
                    />
                    <View style={HomeStyle.modalActions}>
                            <Button mode="outlined" onPress={() => setEditModalVisible(false)} style={HomeStyle.buttonClose}>
                                <Text style={{ color: '#da91a4' }}>Hủy</Text>
                            </Button>
                        <Button mode="contained" onPress={handleEditPost} style={HomeStyle.buttonPost}>Lưu</Button>
                        </View>
                        </View>
                </View>
            </Modal>
            <Modal visible={editCommentModalVisible} onDismiss={() => setEditCommentModalVisible(false)}>
                <View style={HomeStyle.modalContainer}>
                    <View style={HomeStyle.modalContent4}>
                    <Text style={HomeStyle.textPost}>Chỉnh sửa bình luận</Text>
                    <TextInput
                        multiline
                        placeholder="Nhập nội dung bình luận mới..."
                        value={editedCommentContent}
                        onChangeText={setEditedCommentContent}
                        style={HomeStyle.input2}
                    />
                    <View style={HomeStyle.modalActions}>
                            <Button mode="outlined" onPress={() => setEditCommentModalVisible(false)} style={HomeStyle.buttonClose}>
                            <Text style={{color:'#da91a4'}}>Hủy</Text>
                        </Button>
                        <Button mode="contained" onPress={handleEditComment} style={HomeStyle.buttonPost}>Lưu</Button>
                        </View>
                        </View>
                </View>
            </Modal>
            <Modal visible={deleteCommentModalVisible} onDismiss={handleCloseDeleteCommentModal}>
                <View style={HomeStyle.modalContainer}>
                    <View style={HomeStyle.modalContent3}>
                    <Text style={HomeStyle.textPost}>Bạn có chắc chắn muốn xóa bình luận này?</Text>
                    <View style={HomeStyle.modalActions}>
                            <Button mode="outlined" onPress={handleCloseDeleteCommentModal} style={HomeStyle.buttonClose}>
                                <Text style={{color:'#da91a4'}}>Hủy</Text>
                            </Button>
                        <Button mode="contained" onPress={() => handleDeleteComment(commentIdToDelete)} style={HomeStyle.buttonPost}>Xóa</Button>
                        </View>
                        </View>
                </View>
            </Modal>
        </View>
    );
};

export default Home;
