import { Button, FormControl, FormGroup } from 'modules/common/components';
import * as React from 'react';
import { Footer } from './styles';

type Props = {
  replyPost: (
    data: {
      conversationId: string;
      content: string;
      commentReplyToId?: string;
    },
    callback: () => void
  ) => void;
  conversationId: string;
  commentId?: string;
  currentUserName: string;
  closeModal: () => void;
};

type State = {
  post: string;
};

class ReplyingMessage extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      post: ''
    };
  }

  onContentChange = (e: React.FormEvent<HTMLElement>) => {
    const postContent = (e.target as HTMLInputElement).value;

    this.setState({
      post: postContent
    });
  };

  getContent = () => {
    const { currentUserName } = this.props;

    return `@${currentUserName} `;
  };

  doAction = (e: React.FormEvent) => {
    e.preventDefault();

    const { replyPost, conversationId, commentId } = this.props;

    const replyData = {
      conversationId,
      content: this.state.post,
      commentReplyToId: commentId
    };

    return replyPost(replyData, () => {
      this.props.closeModal();
    });
  };

  render() {
    return (
      <form onSubmit={this.doAction}>
        <FormGroup>
          <FormControl
            autoFocus={true}
            componentClass="textarea"
            onChange={this.onContentChange}
            defaultValue={this.getContent()}
            required={true}
          />
        </FormGroup>

        <Footer>
          <Button
            btnStyle="simple"
            onClick={this.props.closeModal}
            icon="cancel-1"
          >
            Close
          </Button>

          <Button btnStyle="success" type="submit" icon="checked-1">
            Post
          </Button>
        </Footer>
      </form>
    );
  }
}

export default ReplyingMessage;
