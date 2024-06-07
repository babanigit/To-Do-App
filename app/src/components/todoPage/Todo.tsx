import { MdDelete } from "react-icons/md";
import { FormatDate } from "../../utils/FormateDates";
import { ITodoModel } from "../modal/todoModal";
import { Card } from "react-bootstrap";


interface IProps {
  todos: ITodoModel;
  ontodosClicked: (todos: ITodoModel) => void;
  onDeleteTodosClicked: (todos: ITodoModel) => void;
  className?: string;
}

const Todo = ({
  todos,
  ontodosClicked,
  // className,
  onDeleteTodosClicked,
}: IProps) => {

  const { title, text, createdAt, updatedAt } = todos;

  let createdUpdatedText: string;

  if (updatedAt > createdAt) {
    createdUpdatedText = "updated: " + FormatDate(updatedAt);
  } else {
    createdUpdatedText = "created: " + FormatDate(createdAt);
  }

  return (<>

<Card
        // className={`${styles.noteCard} ${className}`}
        onClick={() => ontodosClicked(todos)}
      >
        <Card.Body
        //  className={` ${styles.cardBody}`}
         >
          <Card.Title
            // className={`bg-red-200 rounded-md ${styleUtils.flexCenter} `}
          >
            {title}
            <MdDelete
              onClick={(e) => {
                onDeleteTodosClicked(todos);
                e.stopPropagation();
              }}
              className="text-muted ms-auto"
            />
          </Card.Title>
          <Card.Text
          //  className={styles.cardText}
           >{text}</Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted">{createdUpdatedText}</Card.Footer>
      </Card>


  </>);
  
};

export default Todo;
